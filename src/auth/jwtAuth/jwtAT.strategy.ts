import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class jwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            (request: Request) => request?.cookies?.jwtr,
          ]),
        secretOrKey: config.get<string>('AT_SECRET'),
        });
    }

  validate(payload: JwtPayload) {
    console.log("JWT Payload : AT strategy")
    console.log(payload);
    return payload;
  }
}