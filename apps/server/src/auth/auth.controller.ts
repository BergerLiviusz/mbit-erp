import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '../common/rbac/rbac.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: { user: { id: string } }) {
    return this.authService.getMe(req.user.id);
  }

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
