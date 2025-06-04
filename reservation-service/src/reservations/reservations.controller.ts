import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(createReservationDto);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Reservation[]> {
    return this.reservationsService.findByUserId(userId);
  }

  @Delete(':id')
  cancel(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.cancel(id);
  }
} 