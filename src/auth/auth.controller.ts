import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  public signup(@Body() dto: AuthDto) {
    console.log(dto.email, dto.password);
    return this.authService.signup();
  }

  @Post('signin')
  public signin(@Body() dto: AuthDto) {
    return this.authService.signin();
  }
}
