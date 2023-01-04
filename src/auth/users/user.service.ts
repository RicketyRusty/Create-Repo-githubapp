import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { githubUserData } from '../types';

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
}
