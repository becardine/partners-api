import { EventsCoreModule } from '@app/core/events/events-core.module'
import { Module } from '@nestjs/common'
import { EventsController } from './events.controller'

@Module({
  imports: [EventsCoreModule],
  controllers: [EventsController],
})
export class EventsModule {}
