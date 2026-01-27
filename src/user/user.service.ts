import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({ email });

    if (exists) {
      throw new ConflictException('Email já existe.');
    }
  }

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    await this.failIfEmailExists(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const created = this.userRepository.create(newUser);
    const saved = await this.userRepository.save(created);

    return saved;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.email && !dto.name) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.findOneByOrFail({ id });

    user.name = dto.name ?? user.name;

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneByOrFail({ id });

    if (!dto.currentPassword && !dto.newPassword) {
      throw new BadRequestException('Dados não enviados.');
    }

    if (
      !(await this.hashingService.compare(dto.currentPassword, user.password))
    ) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const newHashedPassword = await this.hashingService.hash(dto.newPassword);

    user.password = newHashedPassword;
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.delete(id);

    return user;
  }
}
