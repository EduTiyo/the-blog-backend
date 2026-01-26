import {
  Body,
  Controller,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthenticatedRequest): Promise<User[]> {
    console.log(req.user);

    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.userService.update(req.user.id, dto);
  }
}
