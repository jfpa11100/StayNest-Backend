import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PropertiesService {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const { userId, ...propertyData } = createPropertyDto;
      const newProperty = this.propertyRepository.create({
        ...propertyData,
        user:{id: userId}
      });
      return await this.propertyRepository.save(newProperty)
    } catch (error) {
      console.log(error)
      if (error.code === '22003') throw new InternalServerErrorException('Precio demasiado elevado');
      if (error.code === '22P02') throw new InternalServerErrorException('Parámetro enviado del tipo equivocado');
      throw new InternalServerErrorException('No se pudo crear la propiedad.');
    }
  }

  async findAll() {
    return await this.propertyRepository.find({
      select: {
        id:true,
        title: true,
        address: true,
        pricePerNight: true
      }
    });
  }
  
  async findOne(id: string) {
    return await this.propertyRepository.findOne({
      where: { id },
      relations: ['photo', 'user', 'review'],
    });
  }

  update(id: string, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  async remove(id: string) {
    await this.propertyRepository.delete({ id }).then((response) => {
      if (!response.affected) throw new InternalServerErrorException("La propiedad no pudo ser eliminada");
    });
    return true
  }
}
