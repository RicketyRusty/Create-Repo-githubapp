import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { githubUserData } from '../auth/types';
import * as argon from 'argon2';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class UserService {

	constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOrCreate(userdata: githubUserData) : Promise<User> {	


		// const user = await this.userRepository
		// 	.createQueryBuilder()
		// 	.insert()
		// 	.into(User)
		// 	.values([
		//   	{ githubId: userdata.githubId,
		// 			username: userdata.username,
		// 			displayName: userdata.displayName,
		// 			profilePhoto: userdata.profilePhoto,
		// 			githubaccessToken: userdata.githubaccessToken, },
		// 	])
		// .orUpdate({ conflict_target: ['githubId'], overwrite: ['username', 'displayName', profilePhoto, githubaccessToken] })
		// .execute();
		// console.log(user)
		// return this.userRepository.findOne({where: {githubId: userdata.githubId}});


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

	async encryptAccessToken(accessToken: string) {
		const iv = randomBytes(16);
		const password = 'Password used to generate key';

		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const cipher = createCipheriv('aes-256-ctr', key, iv);

		const textToEncrypt = 'Nest';
		const encryptedText = Buffer.concat([cipher.update(textToEncrypt),cipher.final(),]);
		console.log(encryptedText)
		console.log(iv)
		return {encryptedText, iv};
	}

	async decryptAccessToken(encryptedToken: string, iv: string, key: string) {	
		
		const decipher = createDecipheriv('aes-256-ctr', key, iv);
		//const decryptedText = Buffer.concat([
  		//decipher.update(encryptedToken),
  		//decipher.final(),]);
	}
}
