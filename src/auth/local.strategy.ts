import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const userFounded = await this.authService.validate(email, password);
    if (!userFounded)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    return userFounded;
  }
}
