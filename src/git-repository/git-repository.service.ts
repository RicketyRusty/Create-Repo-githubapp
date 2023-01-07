import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { User } from 'src/auth/entities';
import { UserData } from 'src/auth/types';
import { Repository } from 'typeorm';
import { CreateRepoDto } from './dto/createRepo.dto';
import * as fs from 'fs';
import { Base64 } from 'js-base64';
import { join } from 'path';

@Injectable()
export class GitRepositoryService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async create(repodata: CreateRepoDto, userdata: UserData) {
        const user = await this.userRepository.findOne({where: {id: userdata.id}});
        const auth = user.githubaccessToken;
        const octokit = new Octokit({auth});

        const repos = await octokit.repos.listForAuthenticatedUser({
            owner: user.username,
        })

        if (!repos.data.map((repo) => repo.name).includes(repodata.repositoryName)){
            const resultRepo = await this.createRepo(
                octokit, 
                user.username, 
                repodata.repositoryName, 
                repodata.privacy,
                repodata.description
            );
            console.log(resultRepo)
        } else {
            console.log("Repo Already Exist")
        }

       // const content = fs.readFileSync("./HelloCPP.txt", "utf-8");
        //const contentEncoded = Base64.encode(content);
        const contentEncoded  = btoa("abcd")
        //Process result
         const resultFile = await this.createOrUpdate(
                octokit, 
                user.username,
                contentEncoded, 
                repodata.repositoryName, 
                repodata.path,
                repodata.description,
            );

        //Process Result 
        return resultFile;
    }   


    async createRepo(octokit: Octokit, owner: string, name: string, privacy: boolean, description: string){
        const {data} = await octokit.repos.createForAuthenticatedUser({ owner, name, description, private: privacy, auto_init: true })
        return data;
    }

    async createOrUpdate(octokit: Octokit, owner: string, content: string, repo: string, path: string, description: string){
        const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: path,
            message: description ,
            content: content,
        }); 
        return data;
    }

}
