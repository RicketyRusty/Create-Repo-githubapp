import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities';
import { GithubAuthModule} from './github/githubAuth.module';
import { JwtAuthModule } from './jwt/jwtAuth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    JwtAuthModule,
    GithubAuthModule,
    UserModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: []
})
export class AuthModule {}
