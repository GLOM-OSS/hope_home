import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';

import { Lang } from '@prisma/client';
import { Request } from 'express';
import { CreateMessage } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('/email')
  async sendMessage(@Req() request: Request, @Body() message: CreateMessage) {
    try {
      return await this.appService.sendMessage(
        message,
        request.headers['accept-language'] as Lang
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
