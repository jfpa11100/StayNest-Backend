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
    return await this.propertyRepository.find({
      select: {
        id:true,
        title: true,
        address: true,
        pricePerNight: true,
        capacity: true
      },
      relations: ['photos']
    });
  }
  
  async findOne(id: string) {
    const property = await this.propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.user', 'user') 
      .leftJoinAndSelect('property.photos', 'photo') 
      .leftJoinAndSelect('property.reviews', 'review')
      .leftJoinAndSelect('review.user', 'reviewUser') 
      .where('property.id = :id', { id }) 
      .select([
        'property.title',        
        'property.description',    
        'property.address',      
        'property.pricePerNight',    
        'property.bedrooms',     
        'property.bathrooms',     
        'property.capacity',     
        'user.name',             
        'user.profilePicture',   
        'user.email',         
        'photo.url',          
        'review.comment',        
        'review.rating',      
        'review.createdAt',     
        'reviewUser.name',           
        'reviewUser.username',       
        'reviewUser.profilePicture'   
      ])
      .getOne();
  
    return property;
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
