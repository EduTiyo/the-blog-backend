import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @ApiOperation({
    description: 'Criar um post. Precisa estar autenticado.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth('access-token')
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    const post = await this.postService.create(dto, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  @ApiOperation({
    description: 'Retornar um post autoral. Precisa estar autenticado.',
  })
  @ApiBearerAuth('access-token')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    description: 'Retornar todos posts autorais. Precisa estar autenticado.',
  })
  @ApiBearerAuth('access-token')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOwned(req.user);
    return posts.map(post => new PostResponseDto(post));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  @ApiOperation({
    description: 'Atualizar um post autoral. Precisa estar autenticado.',
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiBearerAuth('access-token')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, dto, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  @ApiOperation({
    description: 'Deletar um post autoral. Precisa estar autenticado.',
  })
  @ApiBearerAuth('access-token')
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.remove({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get(':slug')
  @ApiOperation({
    description:
      'Retornar um post público pelo slug. Não precisa estar autenticado.',
  })
  async findOnePublished(@Param('slug') slug: string) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    });
    return new PostResponseDto(post);
  }

  @Get()
  @ApiOperation({
    description:
      'Retornar todos posts públicos. Não precisa estar autenticado.',
  })
  async findAllPublished() {
    const posts = await this.postService.findAll({ published: true });
    return posts.map(post => new PostResponseDto(post));
  }
}
