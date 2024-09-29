import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';


@Injectable()
export class UsersService {
  

  constructor(

    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  
    ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }
  
  findOneByEmail(email: string){
    return this.userRepository.findOneBy({ email })
  }

  findOneByPass(password: string){
    return this.userRepository.findOneBy({ password })
  }
  findOneByID(id: number){
    return this.userRepository.findOneBy({ id })
  }

  async findAll(): Promise<Usuario[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserById(userId: number): Promise<Usuario | undefined> {
    try {
      const user = await this.userRepository.findOne({where: {id: userId }});
      return user;
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
  
  

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0; // Retorna true si se eliminó algún registro
  }

}

 
