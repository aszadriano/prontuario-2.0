import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { USER_ROLES } from '@prontuario/shared';
import { GoogleCalendarSyncService } from './google-calendar-sync.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly googleCalendarSyncService: GoogleCalendarSyncService
  ) {}

  @Get('authorize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  async authorize(
    @CurrentUser() user: User,
    @Query('redirectUrl') redirectUrl?: string
  ): Promise<{ url: string }> {
    const url = await this.googleAuthService.generateAuthUrl(user, redirectUrl);
    return { url };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string) {
    const result = await this.googleAuthService.handleOAuthCallback(code, state);
    if (result.userId) {
      await this.googleCalendarSyncService.syncUserCalendar(result.userId).catch((error) =>
        console.warn('Failed to sync Google Calendar after OAuth callback', error)
      );
    }
    return result;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  async status(@CurrentUser() user: User) {
    const connected = await this.googleAuthService.hasCredentials(user.id);
    return { connected };
  }
}
