/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { ErrorFilter } from './errors/error.filter';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.useStaticAssets(path.join(__dirname, './assets/uploads'));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );
  app.useGlobalFilters(new ErrorFilter());

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running  on: http://localhost:${port}`);
}

bootstrap();
