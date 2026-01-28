import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'coverImageUrl', 'excerpt', 'content']),
) {
  @IsOptional()
  @IsBoolean({ message: 'Campo de publicar post precisa ser boolean' })
  @ApiPropertyOptional({
    description: 'Indica se o post deve ser publicado',
    example: true,
  })
  published: boolean;
}
