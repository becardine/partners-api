import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { CreateSpotDto } from './dto/create-spot.dto'
import { UpdateSpotDto } from './dto/update-spot.dto'
import { SpotsService } from './spots.service'

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotDto: CreateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({ ...createSpotDto, eventId })
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId)
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.findOne(eventId, spotId)
  }

  @Patch(':spotId')
  update(
    @Param('eventId') eventId: string,
    @Param('spotId') spotId: string,
    @Body() updateSpotDto: UpdateSpotDto,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotDto)
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.remove(eventId, spotId)
  }
}
