import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleCredential } from './entities/google-credential.entity';
import { GoogleEvent } from './entities/google-event.entity';
import { GoogleRepository } from './google.repository';
import { GoogleAuthService } from './google-auth.service';
import { GoogleCalendarSyncService } from './google-calendar-sync.service';
import { GoogleController } from './google.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { GOOGLE_OAUTH_CLIENT_FACTORY, GoogleOAuthClientFactory } from './google.constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([GoogleCredential, GoogleEvent])
  ],
  controllers: [GoogleController],
  providers: [
    GoogleRepository,
    GoogleAuthService,
    GoogleCalendarSyncService,
    {
      provide: GOOGLE_OAUTH_CLIENT_FACTORY,
      useFactory: (configService: ConfigService): GoogleOAuthClientFactory => {
        const clientId = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const redirectUri = configService.get<string>('GOOGLE_REDIRECT_URI');
        if (!clientId || !clientSecret || !redirectUri) {
          throw new Error(
            'Google OAuth credentials are not fully configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI.'
          );
        }

        return () => new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      },
      inject: [ConfigService]
    }
  ],
  exports: [GoogleRepository, GoogleAuthService, GoogleCalendarSyncService]
})
export class GoogleModule {}
