import { Module } from '@nestjs/common';
import { GitRepositoryService } from './git-repository.service';
import { Octokit } from '@octokit/rest';
import { UserModule } from 'src/users/user.module';
import { GitRepositoryController } from './git-repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    GitRepositoryService, 
    {provide: Octokit,useValue: new Octokit()}
  ],
  controllers: [GitRepositoryController],
  exports: []
})
export class GitRepositoryModule {}

