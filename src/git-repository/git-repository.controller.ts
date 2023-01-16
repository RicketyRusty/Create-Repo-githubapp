import { Body, Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { Req, Res, UseFilters, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwtAuth/jwt.guard';
import { UserData } from 'src/auth/types';
import { Request, Response } from 'express';
import { CreateRepoDto } from './dto/createRepo.dto';
import { GitRepositoryService } from './git-repository.service';
import { HttpExceptionFilter, UnAuthFilter, badReqFilter } from 'src/exception-filters';

@Controller('github')
export class GitRepositoryController {
  private logger = new Logger('RepositoryLog');
  constructor(
    private gitRepositoryService: GitRepositoryService,
    ) {}

    //GET request to create repository : Requires UserData
    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter,UnAuthFilter)
    @Get('create')
    async repositoryHome(@Req() req: Request, @Res() res: Response) {
      const user = req.user as UserData;
      return res.render('form', {isAuthenticated: true, user: user.displayName||user.username, photo: user.photo, pageTitle: 'Create Repository',  path: 'create'})
    }
    
    //POST request to create repository : Requires UserData and Repository Information
    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Post('create-repository')
    async createRepository(@Req() req: Request, @Body() repodata: CreateRepoDto, @Res() res: Response) {
      const userdata = req.user as UserData;
      if(repodata.repositoryName === ''){
        throw new HttpException(`Repository Name cannot be empty`, 400);
      }
      this.logger.verbose(`User ${userdata.username} initiated create repository ${repodata.repositoryName}`);
      const {status, data} = await this.gitRepositoryService.create(repodata, userdata)
      if(status === 201){
        const url = data.content.html_url;
        this.logger.verbose(`User ${userdata.username} Successfully created repository ${repodata.repositoryName} at ${url}`);
        return res.redirect(url)
      } else {
        this.logger.verbose(`User ${userdata.username} Failed to create repository ${repodata.repositoryName}`);
        return res.redirect('/github/repository')
        
      }
    }
}
