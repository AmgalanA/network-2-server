import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createAuthDto } from './dtos/create-auth.dto';
import { loginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: createAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: loginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.refresh(refreshToken);
  }
}
