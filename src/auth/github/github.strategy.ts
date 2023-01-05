import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { githubUserData, UserData} from '../types';
import { UserService } from '../../users/user.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {     //fxn that returns a class
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
		// For each strategy, Passport will call the verify function (implemented with this
		// `validate()` method in @nestjs/passport) using an appropriate strategy-specific set of
		// parameters. For the passport-github strategy Passport expects a `validate()` method with
		// the following signature:
		//   `validate(accessToken: string, refreshToken: string, profile: Profile): any`
		// As you can see from this, `validate()` receives the access token and optional refresh
		// token, as well as profile which contains the authenticated user's GitHub profile.
		// We can pass these information to find or create the user in our system.
		// The Passport library expects this method to return a full user if the validation
		// succeeds, or a null if it fails. When returning a user, Passport will complete its tasks
		// (e.g., creating the user property on the Request object), and the request
		// handling pipeline can continue.

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
