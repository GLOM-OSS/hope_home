import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
export class AppModule {}
