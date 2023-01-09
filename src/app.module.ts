import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { GitRepositoryModule } from './git-repository/git-repository.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';


@Module({
  imports: [
    AuthModule,
    GitRepositoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "githubapp",
      autoLoadEntities: true,
      synchronize: true 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
