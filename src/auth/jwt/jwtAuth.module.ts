import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwtAuth.service';
import { jwtAtStrategy } from './jwtAT.strategy';
import { jwtRtStrategy } from './jwtRT.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PassportModule,
		JwtModule.register({}),
    ],
    providers: [JwtAuthService, jwtAtStrategy, jwtRtStrategy],
    exports:[JwtAuthService]
})
export class JwtAuthModule {}
