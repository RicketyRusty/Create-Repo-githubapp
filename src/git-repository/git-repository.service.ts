import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { User } from 'src/auth/entities';
import { UserData } from 'src/auth/types';
import { Repository } from 'typeorm';
import { CreateRepoDto } from './dto/createRepo.dto';
import { Base64 } from 'js-base64';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';


@Injectable()
export class GitRepositoryService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService
    ) {}
    
    async create(repodata: CreateRepoDto, userdata: UserData) {
        const user = await this.userRepository.findOne({where: {id: userdata.id}});
        const auth = user.githubaccessToken;
        const octokit = new Octokit({auth});

        const repos = await octokit.repos.listForAuthenticatedUser({
            owner: user.username,
        })

        if (!repos.data.map((repo) => repo.name).includes(repodata.repositoryName)){
            
            const {status, data} = await this.createRepo(
                octokit, 
                user.username, 
                repodata.repositoryName, 
                repodata.privacy,
                repodata.description
            );
            if(status === 201){
                console.log("Repo Created")
            }
        } else {
            throw new HttpException("Unable to create repository", 400);
        }

        const contentEncoded  = await  this.getFiledata(userdata);
         const {status, data} = await this.createOrUpdate(
                octokit, 
                user.username,
                contentEncoded, 
                repodata.repositoryName, 
                repodata.path,
                repodata.description,
            );
            if(status === 201){
                console.log("File Created")
                return {status, data}
            }
            else {
                throw new HttpException("Unable to add file", 400);
            }
    }   


    async createRepo(octokit: Octokit, owner: string, name: string, _privacy: boolean, description: string){
        const {status, data} = await octokit.repos.createForAuthenticatedUser({ 
            owner, 
            name, 
            description, 
            private: _privacy, 
            auto_init: false })
        return {status, data};
    }

    async createOrUpdate(octokit: Octokit, _owner: string, _content: string, _repo: string, _path: string, _description: string){
        const {status, data} = await octokit.repos.createOrUpdateFileContents({
            owner: _owner,
            repo: _repo,
            path: _path,
            message: _description ,
            content: _content,
        }); 
        return {status, data}
    }

    async getFiledata(userdata: UserData){
        const { data } = await firstValueFrom(
            this.httpService.get<any>('https://catfact.ninja/fact').pipe(
              catchError((error: AxiosError) => {
                console.log(error);
                throw 'An error happened!';
              }),
            ),
          );
        let fact = data.fact;  
        const text = `hello ${userdata.displayName}!, ${fact}`;
        const encodedText = Base64.encode(text);
        return encodedText ;
    }
}
