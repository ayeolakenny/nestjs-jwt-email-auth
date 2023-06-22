import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserCreateInput } from './dto/user.request';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(input: UserCreateInput) {
    const { confirmPassword, email, name, password } = input;

    const isEmailUsed = await this.findOneByEmail(email);

    if (isEmailUsed) {
      throw new BadRequestException({
        name: 'user',
        message: 'email has been used',
      });
    }

    if (confirmPassword !== password) {
      throw new ConflictException({
        name: 'user',
        message: 'password conflict',
      });
    }

    const hashedPassword = await argon2.hash(password);

    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return true;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
