import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(10, 150, { message: 'Título precisa ter entre 10 e 150 caracteres' })
  @ApiProperty({
    description: 'Título do post',
    example: 'Lorem ipsum dolor',
  })
  title: string;

  @IsString({ message: 'Excerto precisa ser uma string' })
  @Length(10, 200, { message: 'Excerto precisa ter entre 10 e 200 caracteres' })
  @ApiProperty({
    description: 'Excerto do post',
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  })
  excerpt: string;

  @IsString({ message: 'Conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo não deve ser vazio' })
  @ApiProperty({
    description: 'Conteúdo do post',
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  })
  content: string;

  @IsOptional()
  @IsUrl(
    { require_tld: false },
    { message: 'URL do post deve ser uma URL válida' },
  )
  @ApiPropertyOptional({
    description: 'Caminho para a imagem do post',
    example: 'http://localhost:3001/uploads/123',
  })
  coverImageUrl?: string;
}
