import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubOauthGuard } from './github/github.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('github/login')
    @UseGuards(GithubOauthGuard)
    async githubAuth() {}

    //Redirect URL for successfull/failed authentication
    @Get('github/callback')
    @UseGuards(GithubOauthGuard)
    githubCallback(){}

    @Post('logout')
    logout() {
        this.authService.logout();
    }

    @Post('refresh')
    refreshToken() {
        this.authService.refreshToken();
    }
}
