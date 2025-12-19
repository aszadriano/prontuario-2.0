import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { USER_ROLES } from '@prontuario/shared';
import { EventsService } from './events.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  list(@CurrentUser() user: User, @Query() query: QueryEventsDto) {
    return this.eventsService.listEvents(user.id, query);
  }

  @Patch('events/:googleEventId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  update(
    @CurrentUser() user: User,
    @Param('googleEventId') googleEventId: string,
    @Body() body: UpdateEventDto
  ) {
    return this.eventsService.updateEvent(user.id, googleEventId, body);
  }
}
