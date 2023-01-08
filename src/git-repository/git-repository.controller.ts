import { Body, Controller, Get, Post } from '@nestjs/common';
import { Render, Req, Res, UseFilters, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwtAuth/jwt.guard';
import { UserData } from 'src/auth/types';
import { Request, Response } from 'express';
import { CreateRepoDto } from './dto/createRepo.dto';
import { GitRepositoryService } from './git-repository.service';
import { UnAuthFilter } from 'src/exception-filters';

@Controller('github')
export class GitRepositoryController {

  constructor(
    private gitRepositoryService: GitRepositoryService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseFilters(UnAuthFilter)
    @Get('repository')
    @Render('form')
    async repositoryHome() {}
  
    @UseGuards(JwtAuthGuard)
    @UseFilters(UnAuthFilter)
    @Post('create-repository')
    async createRepository(@Req() req: Request, @Body() repodata: CreateRepoDto, @Res() res: Response) {
      const userdata = req.user as UserData;
      const result = await this.gitRepositoryService.create(repodata, userdata)
      if(result.status === 201){
        //Flash Message
      }
      return res.redirect('repository')
    }
}