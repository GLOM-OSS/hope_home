import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Person } from '@prisma/client';
import { Request } from 'express';
import { CreateMessage } from './app.dto';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/email')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Req() request: Request, @Body() message: CreateMessage) {
    const { preferred_lang } = request.user as Person;
    try {
      return await this.appService.sendMessage(message, preferred_lang);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
