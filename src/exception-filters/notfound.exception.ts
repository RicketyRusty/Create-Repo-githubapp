import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, NotFoundException } from "@nestjs/common";
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  private logger = new Logger('NotFound');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    this.logger.error(`NotFound: ${exception.message}`);
    //response.status(status).redirect('/home');
    response.render('error.ejs', {status: 404, message: 'Page Not Found', link: '/home', pageTitle: 'Error'})
  }
}
