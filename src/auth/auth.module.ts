import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubAuthModule } from './githubAuth/githubAuth.module';
import { JwtAuthModule } from './jwtAuth/jwtAuth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [JwtAuthModule, GithubAuthModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: []
})
export class AuthModule { }
