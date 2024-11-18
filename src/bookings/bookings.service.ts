import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const { userId, propertyId, ...bookingData } = createBookingDto;
      const newBooking = this.bookingRepository.create({
        ...bookingData,
        user: { id: userId }, 
        property: { id: propertyId }, 
      });
      return await this.bookingRepository.save(newBooking);
    } catch (error) {
      console.log(error);
      if (error.code === '22003') throw new InternalServerErrorException('El precio total es demasiado elevado');
      if (error.code === '22P02') throw new InternalServerErrorException('Parámetro enviado con el tipo incorrecto');
      throw new InternalServerErrorException('No se pudo crear la reserva.');
    }
  }

  async findAllByUser(userId:string) {
    try {
      const bookings = await this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('property.photos', 'photo') 
      .where('booking.userId = :userId', { userId })
      .select([
        'booking.id',     
        'booking.startDate',    
        'booking.endDate',        
        'booking.totalPrice',     
        'property.id',       
        'property.title',        
        'property.address',       
        'property.pricePerNight',  
        'photo.url'                
      ])
      .getMany();

      return bookings;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se pudo obtener la lista de reservas.');
    }
  }

  async findOne(id: string) {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['property', 'user'], 
      });
      if (!booking) throw new InternalServerErrorException('Reserva no encontrada');
      return booking;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se pudo obtener la reserva.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.bookingRepository.delete({ id });
      if (!result.affected) throw new InternalServerErrorException('La reserva no pudo ser eliminada');
      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se pudo eliminar la reserva.');
    }
  }
}
