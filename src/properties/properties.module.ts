import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Review } from './entities/review.entity';
import { Photo } from './entities/photo.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Property, Review, Photo])
  ]
})
export class PropertiesModule {}
