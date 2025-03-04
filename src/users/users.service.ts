import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;

    try {
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password),
        ...user,
      });
  
      const userCreated = await this.userRepository.save(newUser)
      return {
        id:userCreated.id,
        username: userCreated.username,
        name: userCreated.name,
        token: this.getToken({ ...userCreated })
      };
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint === 'UQ_97672ac88f789774dd47f7c8be3') throw new BadRequestException(`Correo inválido`);
        throw new BadRequestException(`Nombre de usuario no disponible`);
      }
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async login(loginUser: LoginUserDto) {
    const { username, password } = loginUser;
    let user = await this.userRepository.findOneBy({ username });
    if(!user)
      user = await this.userRepository.findOneBy({ email:username });
    if (!user || this.isNotValid(password, user.password)) {
      throw new UnauthorizedException('Credenciales Inválidas');
    }
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      isOwner: user.isOwner,
      token: this.getToken(user),
    };
  }

  async findAll() {
    return await this.userRepository.find({
      select: {
        name: true,
        username: true,
        profilePicture: true,
        bio: true,
      }
    });
  }

  async findOne(id: string) {
    const { password, ...user } = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const {userId, ...updateUser} = updateUserDto
      if (updateUser.password){
        updateUser.password = bcryptjs.hashSync(updateUser.password) 
      }
      await this.userRepository.update({ id:userId }, updateUser).then(response => {
        if (!response.affected) throw new BadRequestException("El usuario no pudo ser actualizado");
      });
      
      const user = await this.userRepository.findOne({
        where: { id:userId },
        select: {
          name:true,
          username:true,
          email:true,
          profilePicture:true,
        }
      }) 
      return { 
          ...user,
          token: this.getToken(user)
        }
    } catch (error) {
      if (error.code === '22P02') throw new BadRequestException(`No se econtró el usuario`)
      throw new BadRequestException('El usuario no fue actualizado');
    }
  }

  async remove(id: string) {
    await this.userRepository.delete({ id }).then((response) => {
      if (!response.affected) throw new BadRequestException("El usuario no pudo ser eliminado");
    });
    return true
  }

  private isNotValid(password: string, encripted: string) {
    return !bcryptjs.compareSync(password, encripted);
  }
  
  private getToken(user: User): string {
    return this.jwtService.sign({
      id: user.id,
      username: user.username,
      name: user.name,
    });
  }
}
