
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('BadRequest');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    this.logger.log(`Error: ${exception.message}`);
    response.render('error.ejs', { status: status, message: exception.message, link: '/github/create', pageTitle: 'Error' });
  }
}