import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      const createUserDto = { email: 'felipe@example.com', password: 'password123', name: 'Felipe', number: undefined };
      mockUserRepository.save.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findOneByEmail', () => {
    it('debería retornar el usuario con el email especificado', async () => {
      const email = 'felipe@example.com';
      const user = { id: 1, email: email, password: 'password123', name: 'Felipe' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneByEmail(email);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@example.com');

      expect(result).toBeNull();  // Cambia la expectativa a null
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario por ID', async () => {
      const userId = 1;
      const user = { id: userId, email: 'felipe@example.com', name: 'Felipe' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.getUserById(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(user);
    });

    it('debería lanzar un NotFoundException si el usuario no se encuentra', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const users: Usuario[] = [
        { id: 1, email: 'felipe@example.com', name: 'Felipe', apellido: 'Apellido', number: '123456789', password: 'password123' }
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('debería retornar el usuario correcto', async () => {
      const userId = 1;
      const user = { id: userId, email: 'felipe@example.com', name: 'Felipe' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(user);
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull(); // Cambia la expectativa a null
    });
  });
});
