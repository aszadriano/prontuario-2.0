import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { calendar_v3, google } from 'googleapis';
import { GoogleRepository } from './google.repository';
import { GoogleAuthService } from './google-auth.service';
import { GOOGLE_OAUTH_CLIENT_FACTORY, GoogleOAuthClientFactory } from './google.constants';
import { Inject } from '@nestjs/common';

@Injectable()
export class GoogleCalendarSyncService {
  private readonly logger = new Logger(GoogleCalendarSyncService.name);

  constructor(
    private readonly googleRepository: GoogleRepository,
    private readonly googleAuthService: GoogleAuthService,
    @Inject(GOOGLE_OAUTH_CLIENT_FACTORY)
    private readonly oauthClientFactory: GoogleOAuthClientFactory
  ) {}

  async syncUserCalendar(userId: string): Promise<void> {
    try {
      const accessToken = await this.googleAuthService.getValidAccessToken(userId);
      const oauthClient = this.oauthClientFactory();
      oauthClient.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: oauthClient });

      let pageToken: string | undefined;
      do {
        const { data } = await calendar.events.list({
          calendarId: 'primary',
          singleEvents: true,
          maxResults: 2500,
          orderBy: 'updated',
          pageToken
        });

        for (const event of data.items ?? []) {
          if (!event.id || !event.start || !event.end) {
            continue;
          }

          const start = event.start.dateTime ?? event.start.date;
          const end = event.end.dateTime ?? event.end.date;
          if (!start || !end) {
            continue;
          }

          await this.googleRepository.upsertEvent(userId, {
            googleEventId: event.id,
            summary: event.summary ?? 'Evento sem título',
            description: event.description ?? null,
            startTime: new Date(start),
            endTime: new Date(end),
            updatedAtGoogle: event.updated ? new Date(event.updated) : new Date(),
            rawPayload: event as Record<string, unknown>
          });
        }

        pageToken = data.nextPageToken ?? undefined;
      } while (pageToken);
    } catch (error) {
      this.logger.error(`Failed to sync calendar for user ${userId}`, error as Error);
      throw error;
    }
  }

  async createEventForUser(
    userId: string,
    payload: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | null> {
    try {
      const accessToken = await this.googleAuthService.getValidAccessToken(userId);
      const oauthClient = this.oauthClientFactory();
      oauthClient.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: oauthClient });
      const { data } = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: payload,
        sendUpdates: 'all'
      });
      return data;
    } catch (error) {
      this.logger.warn(
        `Failed to create Google Calendar event for user ${userId}: ${(error as Error).message}`
      );
      throw error;
    }
  }

  async updateEventForUser(
    userId: string,
    eventId: string,
    payload: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | null> {
    try {
      const accessToken = await this.googleAuthService.getValidAccessToken(userId);
      const oauthClient = this.oauthClientFactory();
      oauthClient.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: oauthClient });
      const { data } = await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: payload,
        sendUpdates: 'all'
      });
      return data;
    } catch (error) {
      this.logger.warn(
        `Failed to update Google Calendar event ${eventId} for user ${userId}: ${
          (error as Error).message
        }`
      );
      throw error;
    }
  }

  @Cron('*/5 * * * *')
  async syncAllUsers(): Promise<void> {
    const users = await this.googleRepository.findUsersWithCredentials();
    for (const credential of users) {
      try {
        await this.syncUserCalendar(credential.userId);
      } catch (error) {
        this.logger.warn(
          `Calendar sync failed for user ${credential.userId}: ${(error as Error).message}`
        );
      }
    }
  }
}
