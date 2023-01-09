import { Body, Controller, Get, Post } from '@nestjs/common';
import { Req, Res, UseFilters, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwtAuth/jwt.guard';
import { UserData } from 'src/auth/types';
import { Request, Response } from 'express';
import { CreateRepoDto } from './dto/createRepo.dto';
import { GitRepositoryService } from './git-repository.service';
import { UnAuthFilter, badReqFilter } from 'src/exception-filters';

@Controller('github')
export class GitRepositoryController {

  constructor(
    private gitRepositoryService: GitRepositoryService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter,UnAuthFilter)
    @Get('create')
    async repositoryHome(@Req() req: Request, @Res() res: Response) {
      const user = req.user as UserData;
      return res.render('form', {isAuthenticated: true, user: user.displayName, photo: user.photo, pageTitle: 'Create Repository',  path: 'create'})
    }
  
    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Post('create-repository')
    async createRepository(@Req() req: Request, @Body() repodata: CreateRepoDto, @Res() res: Response) {
      const userdata = req.user as UserData;
      const {status, data} = await this.gitRepositoryService.create(repodata, userdata)
      if(status === 201){
        const url = data.content.html_url;
        return res.redirect(url)
      } else {
        return res.redirect('/github/repository')
      }
    }
}
