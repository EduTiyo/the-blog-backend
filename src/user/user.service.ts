import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (exists) {
      throw new ConflictException('Email já existe.');
    }

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

  save(user: User) {
    return this.userRepository.save(user);
  }
}
