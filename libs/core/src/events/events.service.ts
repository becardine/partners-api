import { Injectable } from '@nestjs/common'
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventDto } from './dto/create-event.dto'
import { ReserveSpotDto } from './dto/reserve-spot.dto'
import { UpdateEventDto } from './dto/update-event.dto'

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

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this._prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    })

    if (spots.length !== dto.spots.length) {
      const missingSpots = dto.spots.filter(
        (spot) => !spots.find((s) => s.name === spot),
      )

      throw new Error(`Spots ${missingSpots.join(', ')} not found`)
    }

    try {
      const tickets = await this._prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          })

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((s) => s.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          })

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                },
              }),
            ),
          )

          return tickets
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      )

      return tickets
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': // Unique constraint violation
          case 'P2034': // Transaction conflict
            throw new Error('One or more spots are already reserved')
        }
      }
      throw e
    }
  }
}
