import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './githubAuth/github.guard';
import { Tokens, UserData } from './types';
import { Request, Response } from 'express';
import { JwtAuthGuard, JwtRefreshGuard } from './jwtAuth/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Get('github/login')
    @Render('login')
    @UseGuards(GithubOauthGuard)
    async githubAuth() {}

    //Redirect URL for successfull/failed authentication
    @Get('github/callback')
    @UseGuards(GithubOauthGuard)
    @Render('home')
    async githubCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        const user = req.user as UserData;
        const {access_token, refresh_token} = await this.authService.githubCallback(user)
		res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
    	return {
			access_token: access_token,
			refresh_token: refresh_token,
		}
    }

    @UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req: Request) {
        return req.user;
	}

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @Render('home')
    logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        return this.authService.logout(user.id); 
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    @Render('login')
    async refreshToken(@Req() req: Request,  @Res() res: Response): Promise<Tokens> {
        const user = req.user; 
        const {access_token, refresh_token} = await this.authService.refreshToken(user['sub'], user['refreshToken']);
        res.cookie('jwt', access_token);
        res.cookie('jwtr', refresh_token);
        return {
			access_token: access_token,
			refresh_token: refresh_token,
		}
    }
}
