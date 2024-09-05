import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    name?: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    number: string;

    @IsString()
    @Transform(({value}) => value.trim()) //limpia caracteres en blanco
    @MinLength(6)
    password: string;


}
