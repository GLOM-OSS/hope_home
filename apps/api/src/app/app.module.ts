import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { DynamicMulter } from '../multer/multer.module';

import { MailModule } from '@hopehome/mailer';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { InjectRedis, Redis, RedisModule } from '@nestjs-modules/ioredis';

import session from 'express-session';
import passport from 'passport';
import RedisStore from 'connect-redis';
import { PassportModule } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { AppMiddleware } from './app.middleware';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
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
export class AppModule {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          name: process.env['SESSION_NAME'],
          store: new RedisStore({ client: this.redis }),
          genid: () => randomUUID(),
          rolling: true,
          saveUninitialized: false,
          secret: process.env['SESSION_SECRET'],
          resave: false,
          cookie: {
            maxAge: 10 * 24 * 3600 * 1000,
          },
        }),
        passport.initialize(),
        passport.session(),
        AppMiddleware
      )
      .forRoutes('*');
  }
}
