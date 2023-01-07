import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens, UserData } from '../types';

@Injectable()
export class JwtAuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async signToken(user: UserData): Promise<Tokens> {
		const { id, githubId, displayName, username, photo} = user;
		const payload: JwtPayload = {
			sub: id,
			githubId,
			username,
			displayName,
			photo: photo.value
		};

		const [accessT, refreshT] = await Promise.all([
			this.jwtService.signAsync(payload, {
			  secret: this.configService.get<string>('AT_SECRET'),
			  expiresIn: '1h',
			}),
			this.jwtService.signAsync(payload, {
			  secret: this.configService.get<string>('RT_SECRET'),
			  expiresIn: '7d',
			}),
		  ]);
	  
		  return {
			access_token: accessT,
			refresh_token: refreshT,
		  };
	}
}
