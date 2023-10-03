/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { ErrorFilter } from './errors/error.filter';

import os from 'os';
import path from 'path';
import cluster from 'cluster';
import helmet from 'helmet';
import * as shell from 'shelljs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.use(helmet());
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

const totalCPUs = os.cpus().length;

if (process.env.NODE_ENV === 'production' && cluster.isPrimary) {
  Logger.log(`Number of CPUs is ${totalCPUs}`);
  Logger.log(`Primary process ${process.pid} is running`);
  shell.exec(
    `npx prisma migrate dev --name deploy && npx prisma migrate deploy`
    // `npx prisma migrate reset --force && npx prisma migrate dev --name deploy && npx prisma migrate deploy`
  );

  // Fork not more than cluster.
  for (let i = 0; i < (totalCPUs <= 2 ? totalCPUs : 2); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    Logger.log({ worker, code, signal });
    Logger.log(`worker ${worker.process.pid} died`);
    Logger.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  bootstrap();
}
bootstrap();
