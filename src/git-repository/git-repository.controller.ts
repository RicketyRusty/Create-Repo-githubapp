import { Body, Controller, Get, Post } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { GitRepositoryService } from './git-repository.service';

@Controller('github')
export class GitRepositoryController {

  constructor(
    private gitRepositoryService: GitRepositoryService,
    ) {}

    @Get('repository')
    async repositoryHome() {
    //Render Create Repository Page
    //return data;
    }
  
    @Get('createrepository')
    async createRepository(
      //@Body('repositoryName') repositoryName: string,
      //@Body('filePath') filePath: string,
      //@Body('fileContent') fileContent: string,
      //@Body('auth') auth: string,
    ) {
      await this.gitRepositoryService.create()
      //content: Buffer.from(fileContent).toString('base64'),
      //return data;
    }
}
