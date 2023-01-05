import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { GitRepositoryModule } from './git-repository/git-repository.module';

@Module({
  imports: [
    AuthModule,
    GitRepositoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type :"sqlite",
      database: "githubapp.db",
      entities: [User],
      synchronize: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
