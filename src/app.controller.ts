import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { optAuthGuard } from './auth/jwtAuth/jwt.guard';
import { Request, Response } from 'express';
import { UserData } from './auth/types';

@Controller('')
export class AppController {

    constructor(
        private appService: AppService,
    ) {}

    @Get()
    goToHome(@Res() res: Response) {
        return res.redirect('/home')
    }
    
    @UseGuards(optAuthGuard)
    @Get('home')
    getHome(@Req() req: Request, @Res() res: Response) {
        if(req.user){
            const user = req.user as UserData;
            return res.render('home', {isAuthenticated: true, user: user.displayName, photo: user.photo, pageTitle: 'Home', path: 'home'})
        }
        else {
            return res.render('home', {isAuthenticated: false, pageTitle: 'Home', path: 'home'})
        }
    }
}
