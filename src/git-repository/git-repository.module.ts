import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GitRepositoryService } from './git-repository.service';
import { Octokit } from '@octokit/rest';
import { UserModule } from 'src/users/user.module';
import { GitRepositoryController } from './git-repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { checkBoolean } from 'src/middleware/checkBool.middleware';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UserModule,
    HttpModule.register({ timeout: 5000, maxRedirects: 5, }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    GitRepositoryService,
    { provide: Octokit, useValue: new Octokit() }
  ],
  controllers: [GitRepositoryController],
  exports: []
})
export class GitRepositoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(checkBoolean)
      .forRoutes(GitRepositoryController);
  }
}
