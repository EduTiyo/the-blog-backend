import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(dto);

    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: AuthenticatedRequest): Promise<UserResponseDto> {
    const user = await this.userService.findOneByOrFail({ id: req.user.id });
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(req.user.id, dto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = await this.userService.updatePassword(req.user.id, dto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.remove(req.user.id);
    return new UserResponseDto(user);
  }
}
