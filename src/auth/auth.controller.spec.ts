import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  


describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        register: jest.fn(),
        login: jest.fn(),
        findUser: jest.fn(),
    };

    const mockJwtService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService, //mock para JwtService
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('register', () => {
        it('debería registrar un nuevo usuario', async () => {
            const registerDto: RegisterDto = {
                email: 'felipe@example.com',
                password: 'password123',
                name: 'Felipe',
                number: '+123456789', 
            };
            mockAuthService.register.mockResolvedValue({ id: 1, email: registerDto.email });

            expect(await authController.register(registerDto)).toEqual({ id: 1, email: registerDto.email });
        });

        it('debería lanzar NotFoundException si falla el registro', async () => {
            const registerDto: RegisterDto = {
                email: 'error@example.com',
                password: 'password123',
                name: 'Felipe',
                number: '+123456789', 
            };
            
            mockAuthService.register.mockRejectedValue(new NotFoundException('No se pudieron registrar el usuario'));

            await expect(authController.register(registerDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('login', () => {
        it('debería iniciar sesión correctamente y devolver un token', async () => {
            const loginDto: LoginDto = {
                email: 'felipe@example.com',
                password: 'password123',
            };
            const result = { access_token: 'token' };
            mockAuthService.login.mockResolvedValue(result);

            expect(await authController.login(loginDto)).toEqual(result);
        });

        it('debería lanzar NotFoundException si falla el inicio de sesión', async () => {
            const loginDto: LoginDto = {
                email: 'error@example.com',
                password: 'wrongpassword',
            };
            
            mockAuthService.login.mockRejectedValue(new NotFoundException('Fallo al inicio de sesión'));

            await expect(authController.login(loginDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('profile', () => {
        it('debería devolver el perfil del usuario', async () => {
            const req = { user: { id: 1, email: 'felipe@example.com' } };

            expect(await authController.profile(req)).toEqual(req.user);
        });
    });
});
