import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<Usuario>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & Usuario>;
    getUserById(userId: number): Promise<Usuario | undefined>;
    findOneByEmail(email: string): Promise<Usuario>;
    findOneByPass(password: string): Promise<Usuario>;
    findOneByID(id: number): Promise<Usuario>;
    findAll(): string;
    findOne(id: number): Promise<Usuario | undefined>;
    remove(id: number): string;
    updatePassword(email: string): Promise<{
        message: string;
    }>;
    updateUserProfile(user: Usuario): Promise<void>;
    private generateRandomPassword;
}
