import { Injectable } from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class EventsService {
  constructor(private _prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this._prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    })
  }

  findAll() {
    return this._prismaService.event.findMany()
  }

  findOne(id: string) {
    return this._prismaService.event.findUnique({
      where: { id },
    })
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this._prismaService.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
    })
  }

  remove(id: string) {
    return this._prismaService.event.delete({
      where: { id },
    })
  }
}
