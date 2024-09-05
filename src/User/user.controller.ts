import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
//import { ResetPassDto } from 'src/auth/dot/resetPass.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.
    usersService.create(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


}

