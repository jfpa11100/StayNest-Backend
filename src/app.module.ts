import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      // synchronize: true
    }),
    UsersModule,
    PropertiesModule,
    BookingsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
