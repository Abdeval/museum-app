import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, ChangePasswordDto } from './auth.dto';
import { JwtGuard } from './auth.guard';
import { UserDecorator } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  index() {
    return 'This is the auth page';
  }

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('updatePassword')
  changePassword(
    @UserDecorator('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
    // console.log(dto, userId);
    // return "pass";
  }
}
