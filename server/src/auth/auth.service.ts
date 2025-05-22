import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto, SignInDto, ChangePasswordDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto?.name,
          // avatar: '@/assets/images/avatars/1.png',
        },
      });

      const { id, password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async login(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Email not found');
    }
    if (!user.password) {
      throw new ForbiddenException('Password missing');
    }
    const valid = await argon.verify(user.password, dto.password);
    if (!valid) {
      throw new ForbiddenException("Password doesn't match");
    }
    // console.log(user);
    const token = await this.signToken(user.id, user.email);
    return {
      access_token: token,
    };
  }

  // ! change password
  async changePassword(userId: number, dto: ChangePasswordDto) {
    if (!userId) throw new ForbiddenException('Not authorized..!');

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new NotFoundException('passwords are not valid');

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    const valid = await argon.verify(user?.password, dto.currentPassword);

    if (!valid) {
      throw new ForbiddenException("Password doesn't match");
    }

    const newHashedPassword = await argon.hash(dto.newPassword);

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHashedPassword,
      },
    });
  }

  async signToken(id: number, email: string): Promise<string> {
    const payload = { id: id, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, { secret });
    return token;
  }
}
