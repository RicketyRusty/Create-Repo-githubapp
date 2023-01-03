import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserData } from 'src/types/userData';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

	constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOrCreate(userData: UserData): Promise<any> {	//specify an dto

		const user = await this.userRepository.findOne({where: {githubId: userData.githubId}});
  			if (user) {
    			return user;
  			}
  			const newUser = this.userRepository.create(userData);
  			await this.userRepository.save(newUser);
  			return newUser;
	}
}
