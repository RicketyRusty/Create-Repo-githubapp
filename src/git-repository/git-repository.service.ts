import { HttpException, Injectable, Logger } from '@nestjs/common';
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
    private logger = new Logger('GithubRepository');
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService
    ) {}
    
    async create(repodata: CreateRepoDto, userdata: UserData) {
        const user = await this.userRepository.findOne({where: {githubId: userdata.githubId}})
        const auth = user.githubaccessToken;
        const octokit = new Octokit({auth});
        try {
            const isValid = await this.checkRepo(octokit, user.username, repodata.repositoryName);
            if (isValid){
                 const responseRepo = await this.createRepo(
                    octokit, 
                    user.username, 
                    repodata.repositoryName, 
                    repodata.privacy,
                    repodata.description
                );
                if(responseRepo.status === 201){
                    this.logger.verbose(`User ${user.username} Created Repository ${responseRepo.data.name}`)
                }
                
                const contentEncoded  = await  this.getFiledata(userdata);
                const responseFile = await this.createOrUpdate(
                        octokit, 
                        user.username,
                        contentEncoded, 
                        responseRepo.data.name, 
                        repodata.path,
                        repodata.description,
                );
                if(responseFile.status === 201){
                    this.logger.verbose(`User ${user.username} Created File ${responseFile.data.content.name}`)
                }
                return responseFile;

            } else {
                throw new HttpException(`Unable to Create Repository`, 400);
            }
            
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }
    
    //Function to check if repository exists or not
    async checkRepo(octokit: Octokit, owner: string, repoName: string): Promise<boolean>{
        try{
            const repos = await octokit.repos.listForAuthenticatedUser({
                owner: owner,
            })
            if(!repos.data.map((repo) => repo.name).includes(repoName)){
                return true;
            } else {
                throw new HttpException(`Unable to Create Repository: Repository already exists`, 400);
            }
        } catch (error) {
            throw new HttpException(error, 400);
        }
    }

    //Function to create repository
    async createRepo(octokit: Octokit, owner: string, name: string, _privacy: boolean, description: string){
        try{
            const responseRepo = await octokit.repos.createForAuthenticatedUser({ 
                owner, 
                name, 
                description, 
                private: _privacy, 
                auto_init: false })
                return responseRepo;
        } catch (error) {
            throw new HttpException(`failed to create Repository`, 400);
        }
        
    }
    
    //Function to create or update file
    async createOrUpdate(octokit: Octokit, _owner: string, _content: string, _repo: string, _path: string, _description: string = 'facts'){
        try {
            const reponseFile = await octokit.repos.createOrUpdateFileContents({
                owner: _owner,
                repo: _repo,
                path: `${_path}.md`,
                message: _description ,
                content: _content,
            }); 
            return reponseFile;
        } catch (error) {
            throw new HttpException(`Failed to create File`, 400);
        }
    }

    //Function to get fact and generate Base64 data for creating file
    async getFiledata(userdata: UserData){
        const { data } = await firstValueFrom(
            this.httpService.get<any>('https://catfact.ninja/fact').pipe(
              catchError((error: AxiosError) => {
                console.log(error);
                throw new HttpException(`Unable to fetch data`, 400);;
              }),
            ),
          );
        let fact = data.fact;  
        const text = `Hello **${userdata.displayName||userdata.username}**!<br/> This Repository is created using Create-Repo-App by Anamitra. <br/> Here's a random Cat fact for you :smiley_cat: <br/>*${fact}*`;
        const encodedText = Base64.encode(text);
        return encodedText ;
    }
}
