import { Module } from '@nestjs/common';
import { UserModule } from '../../users/user.module';
import { GithubOauthStrategy } from './github.strategy';

@Module({
    imports: [UserModule],
    providers: [GithubOauthStrategy],
    exports: []
})
export class GithubAuthModule { }
