import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsString({ message: 'Senha precisa ser uma string.' })
  @IsNotEmpty({ message: 'Senha não deve estar vazia.' })
  password: string;
}
