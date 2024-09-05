import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & import("./entities/user.entity").Usuario>;
    getUserById(userId: number): Promise<import("./entities/user.entity").Usuario>;
    findAll(): string;
    findOne(id: string): Promise<import("./entities/user.entity").Usuario>;
    remove(id: string): string;
}
