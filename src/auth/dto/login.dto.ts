import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
