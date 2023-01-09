import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { Response } from 'express';

@Catch(BadRequestException)
export class badReqFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    //response.status(status).redirect('/home');
  }
}
