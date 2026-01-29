import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não deve ser nula' })
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'senha-do-usuario-atual',
  })
  currentPassword: string;

  @IsString({ message: 'Nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'Nova senha não deve ser nula' })
  @MinLength(6, { message: 'Nova senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'Nova senha a ser utilizada pelo usuário',
    example: 'nova-senha-do-usuario',
  })
  newPassword: string;
}
