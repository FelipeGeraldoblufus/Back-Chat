import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto{

    @IsString()
    @Transform(({value}) => value.trim())
    @MinLength(1)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Número de teléfono inválido' })
    number : string;

    @IsString()
    @Transform(({value}) => value.trim()) //limpia caracteres en blanco
    @MinLength(6)
    password: string;

}