import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from 'src/users/guards/auth/auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllByUser(@Body() body) {
    const userId = body.userId;
    return this.bookingsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.bookingsService.remove(id); 
  }
}
