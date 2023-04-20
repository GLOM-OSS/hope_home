import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: 'uploads/',
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, 'uploads');
        },
        filename: (req, file, callback) => {
          const now = new Date();
          const fileName = file.originalname.split('.')[0];
          const ext = path.extname(file.originalname).toLowerCase();

          let finalName = fileName.replace(/[^a-zA-Z0-9 ]/g, '_').toLowerCase();
          finalName = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}_${finalName}${ext}`;
          callback(null, finalName);
        },
      }),
      fileFilter(req, file, callback) {
        const supportedExtensions = [
          //images
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          //videos
          '.mp4',
          '.webm',

          '.csv',
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!supportedExtensions.includes(ext))
          callback(
            new HttpException(
              `Les fichiers d'extension ${ext} ne sont pas supporté.`,
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        callback(null, true);
      },
    };
  }
}
