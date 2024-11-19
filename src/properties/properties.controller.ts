import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from 'src/users/guards/auth/auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}
  
  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  findAllByUser(@Body() body) {
    const userId = body.userId;
    return this.propertiesService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }
  
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('review')
  addReview(@Body() createReviewDto: CreateReviewDto) {
    return this.propertiesService.addReview(createReviewDto);
  }
}
