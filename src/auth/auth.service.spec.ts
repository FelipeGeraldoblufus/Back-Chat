import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Mock para el UsersService
const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

// Mock para el JwtService
const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'), // Mock para sign
  signAsync: jest.fn().mockResolvedValue('token'), // Mock para signAsync
  verify: jest.fn(), // Puedes agregar más mocks si es necesario
};

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'), // Mock para hash
  compare: jest.fn().mockResolvedValue(true), // Mock para compare
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService }, // Usa el mock para JwtService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario y hashear la contraseña', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null); // Simula que el usuario no existe

      const result = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        password: 'normalpassword',
      });

      expect(mockUsersService.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        password: 'hashedpassword', // Verifica que la contraseña se ha hasheado
      });
      expect(result).toBeUndefined(); // O ajusta según lo que necesites verificar
    });

    it('debería lanzar BadRequestException si el usuario ya existe', async () => {
      mockUsersService.findOneByEmail.mockResolvedValueOnce({}); // Simula que el usuario ya existe

      await expect(authService.register({
        name: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        password: 'normalpassword',
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión con éxito y devolver un token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user); // Simula que se encuentra el usuario
      const result = await authService.login({
        email: 'test@example.com',
        password: 'normalpassword',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('normalpassword', user.password); // Verifica que se llama a compare
      expect(mockJwtService.signAsync).toHaveBeenCalled(); // Verifica que se llama a signAsync
      expect(result).toHaveProperty('token', 'token'); // Verifica que se devuelve el token correcto
      expect(result).toHaveProperty('email', user.email);
    });

    it('debería lanzar UnauthorizedException para un email incorrecto', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null); // Simula que no se encuentra el usuario

      await expect(authService.login({
        email: 'wrong@example.com',
        password: 'normalpassword',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException para una contraseña incorrecta', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user); // Simula que se encuentra el usuario
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // Simula que la contraseña no coincide

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('debería validar un token', async () => {
      const token = 'valid.token';
      const decoded = { email: 'test@example.com', sub: 1 };

      jest.spyOn(mockJwtService, 'verify').mockReturnValue(decoded); // Mock para jwtService.verify

      const result = await authService.validateToken(token);
      expect(result).toEqual(decoded); // Verifica que se devuelven los datos decodificados
    });

    it('debería devolver null para un token inválido', async () => {
      const token = 'invalid.token';
      jest.spyOn(mockJwtService, 'verify').mockImplementation(() => {
        throw new Error('Token inválido'); // Simula un error en la verificación
      });

      const result = await authService.validateToken(token);
      expect(result).toBeNull(); // Verifica que se devuelva null
    });
  });
});
