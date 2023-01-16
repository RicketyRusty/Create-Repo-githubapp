import { Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './githubAuth/github.guard';
import { UserData } from './types';
import { Request, Response } from 'express';
import { JwtAuthGuard, JwtRefreshGuard } from './jwtAuth/jwt.guard';
import { UnAuthFilter, badReqFilter } from 'src/exception-filters';
import { Logger } from '@nestjs/common';
import { timestamp } from 'rxjs';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthenticationLog');
    constructor(
        private authService: AuthService,
    ) { }

    @Get('github/login')
    @UseGuards(GithubOauthGuard)
    async githubAuth() { }

    //Redirect URL for successfull/failed authentication
    @Get('github/callback')
    @UseGuards(GithubOauthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    async githubCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        //Generate Access and Refresh Token
        const user = req.user as UserData;
        const { access_token, refresh_token } = await this.authService.githubCallback(user)
        res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
        this.logger.verbose(`User ${user.username} logged in`);
        return res.redirect('../../home');
    }

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Get('profile')
    getProfile(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        const url = `https://github.com/${user.username}`;
        return res.redirect(url)
    }

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Get('revoke')
    async revokeAccess(@Req() req: Request, @Res() res: Response) {
        await this.authService.revokeAccess(req.user['sub']);
        res.clearCookie('jwt');
        res.clearCookie('jwtr');
        this.logger.verbose(`User ${req.user['username']} Revoked Access and Logged Out`);
        return res.redirect('../../home')
    }

    @UseGuards(JwtAuthGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        this.authService.logout(user['sub']);
        res.clearCookie('jwt');
        res.clearCookie('jwtr');
        this.logger.verbose(`User ${user.username} logged out`);
        return res.redirect('../../home');
    }

    @UseGuards(JwtRefreshGuard)
    @UseFilters(badReqFilter, UnAuthFilter)
    @Get('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const user = req.user;
        const { access_token, refresh_token } = await this.authService.refreshToken(user['sub'], user['refreshToken']);
        res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
        res.redirect('../../home');
    }
}
