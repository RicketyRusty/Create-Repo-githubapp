import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Tokens, UserData } from './types';
import { JwtAuthService } from './jwtAuth';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {

    constructor(
        private jwtAuthService: JwtAuthService,
        private userService: UserService
    ) {}
    
    async githubAuth() {}

    async githubCallback(user : UserData) {
        const { access_token, refresh_token } = await this.jwtAuthService.signToken(user);
        await this.userService.updateRTHash(user.id, refresh_token);
		return {
			access_token: access_token,
			refresh_token: refresh_token,
		}
    }
   
    async logout(userID: number) {
        console.log("logout invoked : Auth Service")
        return await this.userService.deleteRTHash(userID);
    }

    async refreshToken(userID: number, refreshT : string) {
        console.log("Refresh invoked : Auth Service")
        const user = await this.userService.findOne(userID);
        if (!user || !user.jwtrefreshToken) {
            throw new ForbiddenException('Access Denied');
        }
        const rtVerify = await argon.verify(user.jwtrefreshToken, refreshT);
    
        if (!rtVerify) {
            throw new ForbiddenException('Access Denied');
        }
        const userdata: UserData = {
            id: user.id,
            githubId: user.githubId,
            username: user.username,
	        displayName: user.displayName,
	        photo: user.profilePhoto,
	        githubaccessToken: user.githubaccessToken
        }
        const tokens: Tokens = await this.jwtAuthService.signToken(userdata);
        await this.userService.updateRTHash(user.id, tokens.refresh_token);
        return tokens;
    }
}
