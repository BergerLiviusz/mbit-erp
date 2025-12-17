import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/rbac/rbac.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @Public()
  async register(@Body() body: { email: string; password: string; nev: string }) {
    return this.authService.register(body.email, body.password, body.nev);
  }

  @Get('admin-email')
  @Public()
  async getAdminEmail() {
    return this.authService.getAdminEmail();
  }
}
