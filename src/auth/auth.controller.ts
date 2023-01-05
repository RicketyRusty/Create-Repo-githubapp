import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './github/github.guard';
import { Tokens, UserData } from './types';
import { Request, Response } from 'express';
import { JwtAuthGuard, JwtRefreshGuard } from './jwt/jwt.guard';

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
    @Render('login')
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
    @Render('login')
	getProfile(@Req() req: Request) {
        //
	}

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @Render('login')
    logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserData;
        return this.authService.logout(user.id); 
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    @Render('login')
    refreshToken(@Req() req: Request,  @Res() res: Response): Promise<Tokens> {
        const user = req.user; 
        //return this.authService.refreshToken(user['sub'], user['refreshToken']);
        //check any ? Tokens
        const token: any = this.authService.refreshToken(user['sub'], user['refreshToken']);
        res.cookie('jwt', token.access_token);
        res.cookie('jwtr', token.refresh_token);
        return token;
    }
}
