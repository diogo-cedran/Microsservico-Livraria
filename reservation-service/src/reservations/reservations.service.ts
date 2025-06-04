import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  private readonly bookServiceUrl = 'http://localhost:3002/books';

  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private readonly httpService: HttpService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    // Check if book exists and is available
    try {
      const book = await firstValueFrom(
        this.httpService.get(`${this.bookServiceUrl}/${createReservationDto.bookId}`),
      );

      if (book.data.status !== 'disponível') {
        throw new BadRequestException('Book is not available for reservation');
      }

      // Create reservation
      const reservation = this.reservationsRepository.create(createReservationDto);
      const savedReservation = await this.reservationsRepository.save(reservation);

      // Update book status to reserved
      await firstValueFrom(
        this.httpService.patch(`${this.bookServiceUrl}/${createReservationDto.bookId}/status`, {
          status: 'reservado',
        }),
      );

      return savedReservation;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Book not found');
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      where: { userId, status: ReservationStatus.ACTIVE },
    });
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    // Update book status back to available
    await firstValueFrom(
      this.httpService.patch(`${this.bookServiceUrl}/${reservation.bookId}/status`, {
        status: 'disponível',
      }),
    );

    reservation.status = ReservationStatus.CANCELLED;
    return await this.reservationsRepository.save(reservation);
  }
} 