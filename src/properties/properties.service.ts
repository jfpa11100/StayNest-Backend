import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class PropertiesService {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const { userId, photos, ...propertyData } = createPropertyDto;
      const newProperty = this.propertyRepository.create({
        ...propertyData,
        user: { id: userId },
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
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('No se pudo obtener la lista de propiedades.');
    }
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

  async findByUserId(userId: string){
    try {
      const properties = await this.propertyRepository.createQueryBuilder('property')
        .leftJoinAndSelect('property.photos', 'photo') 
        .where('property.userId = :userId', { userId }) 
        .select([
          'property.id',             
          'property.title',           
          'property.address',        
          'property.pricePerNight',    
          'property.capacity',          
          'photo.url'            
        ])
        .getMany();
  
      return properties; 
    } catch (error) {
      throw new InternalServerErrorException('No se pudo obtener la lista de propiedades.');
    }
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: ['photos', 'reviews'],
      });
  
      if (!property) {
        throw new NotFoundException('Property not found');
      }
      const { userId, ...updatedProperty } = updatePropertyDto 

      await this.propertyRepository.save(updatedProperty);
  
      return updatedProperty;
    } catch (error) {
      throw new InternalServerErrorException('Could not update the property.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.propertyRepository.delete({ id });
      if (!result.affected) throw new InternalServerErrorException('La propiedad no pudo ser eliminada');
      return true;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo eliminar la propiedad.');
    }
  }

  async addReview(reviewDto: CreateReviewDto) {
    try {
      const review = {
        user: { id: reviewDto.userId },
        property: { id: reviewDto.propertyId },
        comment: reviewDto.comment,
        rating: reviewDto.rating
      };
      const savedReview = await this.propertyRepository.manager
        .getRepository('Review') 
        .save(review);
      return savedReview;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo agregar la reseña.');
    }
  }
}
