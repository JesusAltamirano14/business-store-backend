import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './interface/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string) {
    const userFounded = await this.usersService.findUserWithEmail(email);
    console.log(email, password);

    if (userFounded && (await bcrypt.compare(password, userFounded.password))) {
      const { password, ...rest } = userFounded;
      return rest;
    }

    console.log(userFounded);

    return null;
  }

  login(userFounded: any) {
    const { name, email, role, businessId } = userFounded;
    const payload: TokenPayload = {
      name,
      email,
      role,
      businessId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
