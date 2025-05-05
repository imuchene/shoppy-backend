import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from 'generated/prisma';
import { StringValue } from 'ms';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CookieNames } from '../../common/enums/cookie-names.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user;
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  login(user: User, response: Response) {
    const expires = new Date();
    const jwtExpiration =
      this.configService.getOrThrow<StringValue>('JWT_EXPIRATION');
    expires.setMilliseconds(expires.getMilliseconds() + ms(jwtExpiration));

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie(CookieNames.Authentication, token, {
      secure: true,
      signed: false,
      sameSite: 'lax',
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }
}
