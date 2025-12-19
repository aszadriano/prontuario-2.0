import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleRepository } from './google.repository';
import { GoogleOAuthClientFactory, GOOGLE_OAUTH_CLIENT_FACTORY } from './google.constants';
import { Inject } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

type StatePayload = { userId: string; redirectUrl?: string };

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/calendar'];

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly encryptionKey: Buffer;
  private readonly stateSecret: string;
  private readonly defaultCallbackRedirect?: string;
  private readonly stateJwt: JwtService;

  constructor(
    private readonly googleRepository: GoogleRepository,
    private readonly configService: ConfigService,
    @Inject(GOOGLE_OAUTH_CLIENT_FACTORY)
    private readonly oauthClientFactory: GoogleOAuthClientFactory
  ) {
    const keySource = this.configService.get<string>('GOOGLE_TOKEN_ENCRYPTION_KEY');
    if (!keySource) {
      throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY must be configured to encrypt refresh tokens.');
    }
    const keyBuffer =
      keySource.length === 44 || keySource.includes('=')
        ? Buffer.from(keySource, 'base64')
        : Buffer.from(keySource, 'utf8');
    if (keyBuffer.length < 32) {
      throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY must resolve to 32 bytes (use base64 for AES-256).');
    }
    this.encryptionKey = keyBuffer.subarray(0, 32);

    this.stateSecret = this.configService.get<string>('GOOGLE_OAUTH_STATE_SECRET') ?? '';
    if (!this.stateSecret) {
      throw new Error('GOOGLE_OAUTH_STATE_SECRET must be configured.');
    }

    this.defaultCallbackRedirect = this.configService.get<string>('GOOGLE_OAUTH_SUCCESS_REDIRECT');
    this.stateJwt = new JwtService({ secret: this.stateSecret });
  }

  async generateAuthUrl(user: User, redirectUrl?: string): Promise<string> {
    const oauthClient = this.oauthClientFactory();
    const payload: StatePayload = {
      userId: user.id,
      redirectUrl: redirectUrl ?? this.defaultCallbackRedirect
    };
    const state = await this.stateJwt.signAsync(payload, { expiresIn: '10m' });
    return oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GOOGLE_SCOPES,
      state
    });
  }

  async handleOAuthCallback(
    code: string,
    state: string
  ): Promise<{ redirectUrl?: string; message?: string; userId: string }> {
    if (!code || !state) {
      throw new BadRequestException('Missing code or state returned by Google');
    }

    let payload: StatePayload;
    try {
      payload = await this.stateJwt.verifyAsync<StatePayload>(state);
    } catch (err) {
      throw new BadRequestException('Invalid state parameter');
    }

    const oauthClient = this.oauthClientFactory();
    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.access_token) {
      throw new BadRequestException('Google did not return an access token');
    }

    await this.persistTokens(payload.userId, tokens);

    return {
      userId: payload.userId,
      redirectUrl: payload.redirectUrl,
      message: payload.redirectUrl
        ? undefined
        : 'Conta Google conectada com sucesso. Você já pode fechar esta janela.'
    };
  }

  async getValidAccessToken(userId: string): Promise<string> {
    const credential = await this.googleRepository.findCredentialByUserId(userId);
    if (!credential) {
      throw new NotFoundException('Google account not connected');
    }

    const now = Date.now();
    if (credential.expiresAt.getTime() > now + 60_000) {
      return credential.accessToken;
    }

    const refreshToken = this.decrypt(credential.refreshTokenEncrypted);
    const client = this.oauthClientFactory();
    client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new BadRequestException('Unable to refresh Google access token');
    }

    credential.accessToken = credentials.access_token;
    credential.expiresAt = credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 55 * 60 * 1000);
    if (credentials.scope) {
      credential.scope = credentials.scope;
    }
    if (credentials.refresh_token) {
      credential.refreshTokenEncrypted = this.encrypt(credentials.refresh_token);
    }

    await this.googleRepository.saveCredential(credential);
    return credential.accessToken;
  }

  private async persistTokens(
    userId: string,
    tokens: { access_token?: string; refresh_token?: string; expiry_date?: number; scope?: string }
  ) {
    const existing = await this.googleRepository.findCredentialByUserId(userId);
    const accessToken = tokens.access_token;
    if (!accessToken) {
      throw new BadRequestException('Missing Google access token');
    }

    let refreshToken = tokens.refresh_token;
    if (!refreshToken && existing) {
      refreshToken = this.decrypt(existing.refreshTokenEncrypted);
    }
    if (!refreshToken) {
      throw new BadRequestException('Google did not return a refresh token');
    }

    await this.googleRepository.saveCredential({
      id: existing?.id,
      userId,
      accessToken,
      refreshTokenEncrypted: this.encrypt(refreshToken),
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 55 * 60 * 1000),
      scope: tokens.scope ?? existing?.scope ?? GOOGLE_SCOPES.join(' ')
    });
  }

  hasCredentials(userId: string): Promise<boolean> {
    return this.googleRepository.hasCredential(userId);
  }

  private encrypt(value: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decrypt(payload: string): string {
    const [ivHex, tagHex, valueHex] = payload.split(':');
    if (!ivHex || !tagHex || !valueHex) {
      throw new BadRequestException('Invalid encrypted payload');
    }
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(valueHex, 'hex')),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  }
}
