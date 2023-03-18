import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
  @Post('uploads')
  @UseInterceptors(FileInterceptor('image_ref', { dest: 'images' }))
  uploads(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
