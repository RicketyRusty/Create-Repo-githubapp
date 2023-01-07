import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { githubUserData } from '../auth/types';
import * as argon from 'argon2';

@Injectable()
export class UserService {

	constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOrCreate(userdata: githubUserData): Promise<User> {	
		//TO DO : Optimize query

		const user = await this.userRepository.findOne({where: {githubId: userdata.githubId}});
  			if (user) {
    			await this.userRepository.update({id: user.id}, {
					githubId: userdata.githubId,
					username: userdata.username,
					displayName: userdata.displayName,
					profilePhoto: userdata.profilePhoto,
					githubaccessToken: userdata.githubaccessToken,
				});
  			}
			else {
				const newUser = this.userRepository.create(userdata);
  				await this.userRepository.save(newUser);
			}
  			return this.userRepository.findOne({where: {githubId: userdata.githubId}});
	}

	async findOne(userID : number) {
		const user = await this.userRepository.findOne({where: {id: userID}});
		if(!user){

		}
		return user;
	}

	async updateRTHash(userID: number , rtoken: string){
		const hash = await argon.hash(rtoken);
		return await this.userRepository.update({id: userID}, {jwtrefreshToken: hash});
	}

	async deleteRTHash(userID: number) {
		return await this.userRepository.update({id: userID}, {jwtrefreshToken: null});
	}
}
