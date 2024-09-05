import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/User/user.service';
import { RegisterDto } from './dto/register.dto';
import { Usuario } from 'src/User/entities/user.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    generateToken(user: Usuario): Promise<string>;
    login({ email, password }: LoginDto): Promise<{
        token: string;
        email: string;
        name: string;
        number: string;
    }>;
    register({ name, email, number, password }: RegisterDto): Promise<import("../User/dto/create-user.dto").CreateUserDto & Usuario>;
}
