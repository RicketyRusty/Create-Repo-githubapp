import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NotFoundFilter } from './exception-filters/notfound.exception';
import { HttpExceptionFilter } from './exception-filters';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter(), new NotFoundFilter());
  const configService = app.get(ConfigService);
  const logger = new Logger()
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const PORT = configService.get<number>('PORT') || 5000;
  await app.listen(PORT);
  logger.log(`Server running on Port ${PORT}`);
}
bootstrap();
