import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import * as argon from 'argon2';
import { Tokens, UserData } from './types';
import { JwtAuthService } from './jwt';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtAuthService: JwtAuthService
    ) {}
    
    async githubAuth() {}

    async githubCallback(user : UserData) {
        const { access_token, refresh_token } = await this.jwtAuthService.signToken(user);
        await this.updateRtHash(user.id, refresh_token);
		return {
			access_token: access_token,
			refresh_token: refresh_token,
		}
    }
   
    async logout(userID: number) {
        console.log("logout invoked")
        return await this.userRepository.update({id: userID}, {jwtrefreshToken: null});
    }

    async refreshToken(userID: number, refreshT : string) {
        const user = await this.userRepository.findOne({where: {id: userID}});
        if (!user || !user.jwtrefreshToken) throw new ForbiddenException('Access Denied');

        const rtVerify = await argon.verify(user.jwtrefreshToken, refreshT);
        if (!rtVerify) throw new ForbiddenException('Access Denied');
        const userdata: UserData = {
            id: user.id,
            githubId: user.githubId,
            username: user.username,
	        displayName: user.displayName,
	        photo: user.profilePhoto,
	        githubaccessToken: user.githubaccessToken
        }
        const tokens: Tokens = await this.jwtAuthService.signToken(userdata);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userID: number , refreshT : string) {
        const hash = await argon.hash(refreshT);
        return await this.userRepository.update({id: userID}, {jwtrefreshToken: hash});
    }

}
