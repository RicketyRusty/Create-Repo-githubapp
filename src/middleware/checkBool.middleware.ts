import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class checkBoolean implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body.privacy = (req.body.privacy === "true" ? true : false);
    next();
  }
}
