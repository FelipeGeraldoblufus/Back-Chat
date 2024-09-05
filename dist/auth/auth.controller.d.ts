import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    profile(req: any): any;
    register(registerDto: RegisterDto): Promise<import("../User/dto/create-user.dto").CreateUserDto & import("../User/entities/user.entity").Usuario>;
    login(logindto: LoginDto): Promise<{
        token: string;
        email: string;
        name: string;
        number: string;
    }>;
}
