import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('insert-admin')
  insertAdmin() {
    return this.usersService.insertAdmin();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user')
  async getUser(@Req() req) {
    return req.user;
  }
}
