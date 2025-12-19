import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleRepository } from '../google/google.repository';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GoogleCalendarSyncService } from '../google/google-calendar-sync.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly googleRepository: GoogleRepository,
    private readonly googleCalendarSyncService: GoogleCalendarSyncService
  ) {}

  async listEvents(userId: string, query: QueryEventsDto) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;
    const events = await this.googleRepository.listEventsForUser(userId, {
      from,
      to,
      limit: query.limit ?? 200
    });

    return {
      items: events,
      meta: { total: events.length }
    };
  }

  async updateEvent(userId: string, googleEventId: string, body: UpdateEventDto) {
    const existing = await this.googleRepository.findEventByGoogleId(userId, googleEventId);
    if (!existing) {
      throw new NotFoundException('Evento do Google não encontrado');
    }

    const nextStart = body.startTime ? new Date(body.startTime) : existing.startTime;
    const nextEnd = body.endTime ? new Date(body.endTime) : existing.endTime;
    const nextSummary = body.summary ?? existing.summary;
    const nextDescription = body.description ?? existing.description;

    await this.googleCalendarSyncService.updateEventForUser(userId, googleEventId, {
      summary: nextSummary,
      description: nextDescription ?? undefined,
      start: {
        dateTime: nextStart.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: nextEnd.toISOString(),
        timeZone: 'America/Sao_Paulo'
      }
    });

    await this.googleRepository.upsertEvent(userId, {
      id: existing.id,
      googleEventId,
      summary: nextSummary,
      description: nextDescription,
      startTime: nextStart,
      endTime: nextEnd,
      updatedAtGoogle: new Date()
    });

    return {
      ...existing,
      summary: nextSummary,
      description: nextDescription,
      startTime: nextStart,
      endTime: nextEnd
    };
  }
}
