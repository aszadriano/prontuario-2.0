import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { USER_ROLES } from '@prontuario/shared';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => true)
}));

const mockUser: User = Object.assign(new User(), {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: USER_ROLES.MEDICO,
  passwordHash: 'hash'
});

describe('AuthService', () => {
  let authService: AuthService;
  const usersService = {
    findOneByEmail: jest.fn()
  };
  const jwtService = {
    signAsync: jest.fn(() => Promise.resolve('token'))
  };
  const configService = {
    get: jest.fn(() => '1h')
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService }
      ]
    }).compile();

    authService = moduleRef.get(AuthService);
    jest.clearAllMocks();
  });

  it('logs in user with valid credentials', async () => {
    usersService.findOneByEmail.mockResolvedValue(mockUser);

    const result = await authService.login({ email: mockUser.email, password: 'secret' });

    expect(result.tokens.accessToken).toBe('token');
    expect(result.user.email).toBe(mockUser.email);
  });

  it('throws for invalid email', async () => {
    usersService.findOneByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'missing@example.com', password: 'secret' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('builds auth payload', async () => {
    const payload = await authService.buildAuthPayload(mockUser);
    expect(payload.tokens.accessToken).toBe('token');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role
    });
  });
});
