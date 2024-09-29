import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Usuario } from './entities/user.entity'; 

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            getUserById: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('debe crear un nuevo usuario', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        number: '+123456789' 
      };

      // Simula la creación del usuario, devolviendo un objeto que representa al usuario
      const user: Usuario = {
        id: 1,
        ...createUserDto,
      } as Usuario;

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await usersController.create(createUserDto);

      expect(result).toEqual(user);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getUserById', () => {
    it('debe retornar el usuario si se encuentra', async () => {
      const user: Usuario = { id: 1, email: 'test@example.com', name: 'Test User',apellido: 'Test apellido', number: '123456789', password: 'password123' }; // Asegúrate de incluir todos los campos necesarios

      jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);

      const result = await usersController.getUserById(1);

      expect(result).toEqual(user);
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValue(undefined);

      await expect(usersController.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios', async () => {
      const users: Usuario[] = [
        { id: 1, email: 'test@example.com', name: 'Test User',apellido: 'Test apellido', number: '123456789', password: 'password123' }
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      const result = await usersController.findAll();

      expect(result).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debe retornar el usuario correcto', async () => {
      const user: Usuario = { id: 1, email: 'test@example.com', name: 'Test User',apellido: 'Test apellido', number: '123456789', password: 'password123' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await usersController.findOne('1');

      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('debe eliminar el usuario', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined); 

      const result = await usersController.remove('1');

      expect(result).toBeUndefined(); 
      expect(usersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
