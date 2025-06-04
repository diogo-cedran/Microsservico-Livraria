import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;
} 