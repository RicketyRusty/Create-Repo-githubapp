import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnAuthFilter implements ExceptionFilter {
  private logger = new Logger('UnAuthorizedAccess');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    this.logger.error(`Unauthorized: ${exception.message}`)
    response.status(status).redirect('/auth/github/login');
  }
}