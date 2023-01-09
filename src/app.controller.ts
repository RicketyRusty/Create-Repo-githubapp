import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { optAuthGuard } from './auth/jwtAuth/jwt.guard';
import { Request, Response } from 'express';

@Controller('')
export class AppController {

    constructor(
        private appService: AppService,
    ) {}

    @UseGuards(optAuthGuard)
    @Get('home')
    @Render('home')
    getHome(@Req() req: Request) {
        console.log("home user")
        console.log(req.user)
    }
}
