import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { githubUserData } from '../auth/types';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) { }

	async findOrCreate(userdata: githubUserData): Promise<User> {


		const user = await this.userRepository
			.createQueryBuilder()
			.insert()
			.into(User)
			.values({
				id: null,
				githubId: userdata.githubId,
				username: userdata.username,
				displayName: userdata.displayName,
				profilePhoto: userdata.profilePhoto,
				githubaccessToken: userdata.githubaccessToken,
			})
			.orUpdate(
				["username", "displayName", "profilePhoto", "githubaccessToken"],
				["githubId"],
			)
			.execute();
		return this.userRepository.findOne({ where: { githubId: userdata.githubId } });
	}

	async findOne(userID: number) {
		const user = await this.userRepository.findOne({ where: { id: userID } });
		if (!user) {
			throw new HttpException('User not found', 404);
		}
		return user;
	}

	async deleteUser(userID: number) {
		return await this.userRepository.delete({ id: userID });
	}

	async updateRTHash(userID: number, rtoken: string) {
		const hash = await argon.hash(rtoken);
		return await this.userRepository.update({ id: userID }, { jwtrefreshToken: hash });
	}

	async deleteRTHash(userID: number) {
		return await this.userRepository.update({ id: userID }, { jwtrefreshToken: null });
	}
}
