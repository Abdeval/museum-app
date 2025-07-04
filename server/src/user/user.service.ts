import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: number) {
    const res = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return res;
  }
}
