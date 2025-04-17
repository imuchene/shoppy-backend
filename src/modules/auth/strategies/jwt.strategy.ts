import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => String(request.signedCookies.Authentication),
      ]),
      secretOrKey: fs
        .readFileSync(configService.getOrThrow('JWT_ACCESS_TOKEN_PUBLIC_KEY'))
        .toString(),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
