import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsEmail, IsEnum, IsInt, IsUUID } from 'class-validator';

export const UserDecorator = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  },
);

export class UserDecoratorDto {
  @IsInt()
  id: number;
  @IsEmail()
  email: string;
}
