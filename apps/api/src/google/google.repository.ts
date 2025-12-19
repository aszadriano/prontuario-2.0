import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleCredential } from './entities/google-credential.entity';
import { GoogleEvent } from './entities/google-event.entity';

@Injectable()
export class GoogleRepository {
  constructor(
    @InjectRepository(GoogleCredential)
    private readonly credentialsRepository: Repository<GoogleCredential>,
    @InjectRepository(GoogleEvent)
    private readonly eventsRepository: Repository<GoogleEvent>
  ) {}

  findCredentialByUserId(userId: string): Promise<GoogleCredential | null> {
    return this.credentialsRepository.findOne({ where: { userId } });
  }

  findUsersWithCredentials(): Promise<GoogleCredential[]> {
    return this.credentialsRepository.find();
  }

  async saveCredential(credential: Partial<GoogleCredential>): Promise<GoogleCredential> {
    const entity = this.credentialsRepository.create(credential);
    return this.credentialsRepository.save(entity);
  }

  async hasCredential(userId: string): Promise<boolean> {
    const count = await this.credentialsRepository.count({ where: { userId } });
    return count > 0;
  }

  async upsertEvent(userId: string, payload: Partial<GoogleEvent>): Promise<GoogleEvent> {
    const existing = await this.eventsRepository.findOne({
      where: { userId, googleEventId: payload.googleEventId as string }
    });
    if (existing) {
      Object.assign(existing, payload);
      return this.eventsRepository.save(existing);
    }

    return this.eventsRepository.save(
      this.eventsRepository.create({
        userId,
        ...payload
      })
    );
  }

  listEventsForUser(
    userId: string,
    options: { from?: Date; to?: Date; limit?: number }
  ): Promise<GoogleEvent[]> {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId })
      .orderBy('event.startTime', 'ASC');

    if (options.from) {
      qb.andWhere('event.startTime >= :from', { from: options.from });
    }
    if (options.to) {
      qb.andWhere('event.endTime <= :to', { to: options.to });
    }
    if (options.limit) {
      qb.limit(options.limit);
    }

    return qb.getMany();
  }

  findEventByGoogleId(userId: string, googleEventId: string): Promise<GoogleEvent | null> {
    return this.eventsRepository.findOne({ where: { userId, googleEventId } });
  }
}
