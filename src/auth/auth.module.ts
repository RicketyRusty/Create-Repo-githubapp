import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities';
import { GithubOauthStrategy } from './github/github.strategy';
import { jwtAtStrategy, JwtAuthService, jwtRtStrategy } from './jwt';
import { UserService } from './users/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
		JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, GithubOauthStrategy, UserService, jwtAtStrategy, jwtRtStrategy, JwtAuthService],
  exports: []
})
export class AuthModule {}
