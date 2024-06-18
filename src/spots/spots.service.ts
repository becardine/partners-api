import { Injectable } from '@nestjs/common'
import { SpotStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSpotDto } from './dto/create-spot.dto'
import { UpdateSpotDto } from './dto/update-spot.dto'

@Injectable()
export class SpotsService {
  constructor(private _prismaService: PrismaService) {}

  create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = this._prismaService.event.findUnique({
      where: { id: createSpotDto.eventId },
    })

    if (!event) throw new Error('Event not found')

    return this._prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
      },
    })
  }

  findAll(eventId: string) {
    return this._prismaService.spot.findMany({ where: { eventId } })
  }

  findOne(eventId: string, spotId: string) {
    return this._prismaService.spot.findUnique({
      where: { id: spotId, eventId },
    })
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this._prismaService.spot.update({
      where: { id: spotId, eventId },
      data: updateSpotDto,
    })
  }

  remove(eventId: string, spotId: string) {
    return this._prismaService.spot.delete({ where: { id: spotId, eventId } })
  }
}
