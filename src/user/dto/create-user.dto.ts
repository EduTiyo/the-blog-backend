import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'Nome não deve estar vazia.' })
  name: string;

  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsString({ message: 'Senha precisa ser uma string.' })
  @IsNotEmpty({ message: 'Senha não deve estar vazia.' })
  password: string;
}
