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
  
      const { password: _, ...userCreated } = await this.userRepository.save(newUser)
      return {
        username: userCreated.username,
        name: userCreated.name,
        token: this.getToken({ password, ...userCreated })
      };
    } catch (error) {
      if ((error.code = '23505')) {
        throw new BadRequestException(`${createUserDto.username} ya existe.`);
      }
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async login(loginUser: LoginUserDto) {
    const { username, password } = loginUser;
    const user = await this.userRepository.findOneBy({ username });
    if (!user || this.isNotValid(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return {
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture,
      token: this.getToken(user),
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((item) => {
      const { password, ...users } = item;
      return users;
    });
  }

  async findOne(id: string) {
    const { password, ...user } = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(id: string, updateUser: UpdateUserDto) {
    try {
      if (updateUser.password){
        updateUser.password = bcryptjs.hashSync(updateUser.password) 
      }
      await this.userRepository.update({ id }, updateUser).then((response) => {
          if (!response.affected) throw new BadRequestException("El usuario no pudo ser actualizado");
        });

      return this.userRepository.findOne({
        where: { id },
        select: {
          name:true,
          username:true,
          email:true,
          profilePicture:true
        }
      })
    } catch (error) {
      throw new BadRequestException('El usuario no pudo ser actualizado');
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
