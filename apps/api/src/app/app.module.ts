import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import helmet from 'helmet';
import * as shell from 'shelljs';
import { DynamicMulter } from '../multer/multer.module';

import { MailModule } from '@hopehome/mailer';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { AppMiddleware } from './app.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot(),
    MailModule,
    DynamicMulter,
    PrismaModule,
    AuthModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'production') {
      console.log(process.env.DATABASE_URL);
      shell.exec(`npx prisma migrate dev --name deploy`);
      shell.exec(`npx prisma migrate deploy`);
    }

    consumer.apply(helmet(), AppMiddleware).forRoutes('*');
  }
}
