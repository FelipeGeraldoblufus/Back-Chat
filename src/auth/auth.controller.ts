import { Body, Controller, Get, NotFoundException, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService
        
    ) {}

    @Get("profile")
    @UseGuards(AuthGuard)
    profile(
        @Request() req,
    ){
        return req.user;
    }




    @Post("register")
    register(
        @Body()
        registerDto: RegisterDto
    ) {
        
        try{return this.authService.register(registerDto);
        }catch (error) {
            throw new NotFoundException(`No se pudieron registrar el usuario`);
          }
    }

    @Post("login")
    login(
        @Body()
        logindto: LoginDto, 

    ) {
        try{
            return this.authService.login(logindto);

        }catch (error) {
            throw new NotFoundException(`Fallo al inicio de sesion`);
          }
    }



}
