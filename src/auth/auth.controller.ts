import { Controller, Get, Post, Redirect, Render, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './githubAuth/github.guard';
import { Tokens, UserData } from './types';
import { Request, Response } from 'express';
import { JwtAuthGuard, JwtRefreshGuard } from './jwtAuth/jwt.guard';
import { UnAuthFilter, badReqFilter } from 'src/exception-filters';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Get('github/login')
    @UseGuards(GithubOauthGuard)
    async githubAuth() {}

    //Redirect URL for successfull/failed authentication
    @Get('github/callback')
    @UseGuards(GithubOauthGuard)
    @UseFilters(badReqFilter,UnAuthFilter)
    @Render('home')
    async githubCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        const user = req.user as UserData;
        const {access_token, refresh_token} = await this.authService.githubCallback(user)
		res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
        return res.redirect('../../home');
    }

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
	@Post('profile')
	getProfile(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        const url = `https://github.com/${user.username}`;
        return res.redirect(url) 
	}

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        this.authService.logout(user.id);
        res.clearCookie('jwt');
        res.clearCookie('jwtr');
        return res.redirect('../../home');
    }

    @UseGuards(JwtRefreshGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Get('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const user = req.user; 
        const {access_token, refresh_token} = await this.authService.refreshToken(user['sub'], user['refreshToken']);
        res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
        res.redirect('../../home');
    }
}
