import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { User } from 'src/auth/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GitRepositoryService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async create() {
        console.log('Its called Repo+')
        const user = await this.userRepository.findOne({where: {id: 2}});
        const auth = user.githubaccessToken;
        const octokit = new Octokit({auth});
        return this.createRepo(octokit, 'ricketyrusty', 'coderepo')
    }


    async createRepo(octokit: Octokit, owner: string, name: string){
        await octokit.repos.createForAuthenticatedUser({ owner, name, private: false, auto_init: true })
    }

    async createOrUpdate(octokit: Octokit, owner: string, repo: string, path: string, content: string, message: string){
        

        let contentEncoded; //= Base64.encode(text);
        const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: "OUTPUT.md",
            message: message ,
            content: contentEncoded,
        });
    }

}
