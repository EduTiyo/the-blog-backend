import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';
import { generateRandomSufix } from 'src/common/utils/gerenate-random-sufix';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: `${createSlugFromText(dto.title)}-${generateRandomSufix()}`,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImageUrl,
      author,
    });

    const created = await this.postRepository
      .save(post)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          this.logger.error('Erro ao criar post', err.stack);
        }
        throw new BadRequestException('Erro ao criar post');
      });

    return created;
  }
}
