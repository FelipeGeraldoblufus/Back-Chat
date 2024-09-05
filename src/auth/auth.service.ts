import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/User/user.service';
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dto/register.dto';
import { Usuario } from 'src/User/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService

    ) {}

    async generateToken(user: Usuario) {
        const payload = { email: user.email, sub: user.id, name: user.name };
        return this.jwtService.sign(payload);
      }
    
      async login({email, password}: LoginDto){

        const user = await this.usersService.findOneByEmail(email);
        if (!user){

            throw new UnauthorizedException("Email is wrong")

        }
        // Compara la contraseña proporcionada con la contraseña encriptada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new UnauthorizedException('Password is wrong');
        }
        const payload = { id: user.id, email: user.email, name: user.name, number: user.number };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email: user.email,
            name: user.name,
            number: user.number

        };
    }


    async register({name, email, number, password}: RegisterDto){

        const user = await this.usersService.findOneByEmail(email);
        if (user){

            throw new BadRequestException("User already exists")

        }
        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.usersService.create({
            name, 
            email, 
            number,
            password: hashedPassword
            
        });
    }











}
