import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './github/github.guard';
import { GithubOauthStrategy } from './github/github.strategy';
import { UserModule } from './users/user.module';
import { UserService } from './users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, GithubOauthStrategy, UserService],
  exports: []
})
export class AuthModule {}
