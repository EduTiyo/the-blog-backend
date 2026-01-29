import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'Nome não deve estar vazia.' })
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'user',
  })
  name: string;

  @IsEmail({}, { message: 'Email inválido.' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@email.com',
  })
  email: string;

  @IsString({ message: 'Senha precisa ser uma string.' })
  @IsNotEmpty({ message: 'Senha não deve estar vazia.' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'uma-senha-forte',
  })
  password: string;
}
