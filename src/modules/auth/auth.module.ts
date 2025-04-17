import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as fs from 'fs';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: fs
          .readFileSync(
            configService.getOrThrow('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
          )
          .toString(),
        publicKey: fs
          .readFileSync(configService.getOrThrow('JWT_ACCESS_TOKEN_PUBLIC_KEY'))
          .toString(),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
          algorithm: 'PS256',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
