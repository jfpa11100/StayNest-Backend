import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Property } from 'src/properties/entities/property.entity';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports:[
    TypeOrmModule.forFeature([Booking, User, Property])
  ]
})
export class BookingsModule {}
