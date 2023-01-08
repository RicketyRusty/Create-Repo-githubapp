import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { githubUserData, UserData} from '../types';
import { UserService } from '../../users/user.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {    
	constructor(
		private configService: ConfigService,
		private usersService: UserService,
	) {
		super({
			clientID: configService.get<string>('GITHUB_OAUTH_CLIENT_ID'),
			clientSecret: configService.get<string>('GITHUB_OAUTH_CLIENT_SECRET'),
			callbackURL: configService.get<string>('GITHUB_OAUTH_CALLBACK_URL'),
			scope: ['public_profile', 'repo', 'workflow'],
		});
	}

	async validate(accessToken: string, _refreshToken: string, profile: Profile) {
		const githubUserData: githubUserData = {
			githubId: profile.id,
			displayName: profile.displayName,
			username: profile.username,
			profilePhoto: profile.photos[0],
			githubaccessToken: accessToken
		}
		
		const userDB = await this.usersService.findOrCreate(githubUserData);
		if (!userDB) {
			throw new UnauthorizedException();
		}
		const user: UserData = {
			id: userDB.id,
			githubId: userDB.githubId,
			username: userDB.username,
			displayName: userDB.displayName,
			photo: userDB.profilePhoto,
			githubaccessToken: userDB.githubaccessToken,
		}
		return user;
	}
}
