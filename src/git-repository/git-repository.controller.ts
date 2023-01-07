import { Body, Controller, Get, Post } from '@nestjs/common';
import { Render, Req, Res, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwtAuth/jwt.guard';
import { UserData } from 'src/auth/types';
import { Request, Response } from 'express';
import { CreateRepoDto } from './dto/createRepo.dto';
import { GitRepositoryService } from './git-repository.service';

@Controller('github')
export class GitRepositoryController {

  constructor(
    private gitRepositoryService: GitRepositoryService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('repository')
    @Render('create')
    async repositoryHome() {
      return {msg : "github create page"}
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('createrepository')
    async createRepository(@Req() req: Request, @Body() repodata: CreateRepoDto, @Res() res: Response) {
      const userdata = req.user as UserData;
      const result = await this.gitRepositoryService.create(repodata, userdata)
      return result;
    }
}
