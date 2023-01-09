import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    //response.status(status).redirect('/home');
    response.render('error.ejs', {status: 404, message: 'Page Not Found', link: '/home', pageTitle: 'Error'})
  }
}
