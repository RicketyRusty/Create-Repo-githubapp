import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundFilter } from './exception-filters/notfound.exception';
import { HttpExceptionFilter } from './exception-filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter(), new NotFoundFilter());
  app.useStaticAssets(join(__dirname, '..' , 'public'));
  app.setBaseViewsDir(join(__dirname, '..' , 'views'));
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();
