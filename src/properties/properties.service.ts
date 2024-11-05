import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PropertiesService {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const { userId, photos, ...propertyData } = createPropertyDto;
      const newProperty = this.propertyRepository.create({
        ...propertyData,
        user:{id: userId},
        photos: photos.map(photo => this.photoRepository.create(photo)),
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
    const properties = await this.propertyRepository.find({
      select: {
        id:true,
        title: true,
        address: true,
        pricePerNight: true
      },
      relations: ['photos']
    });
    return properties.map(p => ({
      id: p.id,
      title: p.title,
      address: p.address,
      pricePerNight: p.pricePerNight,
      photos: p.photos.length > 0 ? [p.photos[0]] : []
    }))
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
