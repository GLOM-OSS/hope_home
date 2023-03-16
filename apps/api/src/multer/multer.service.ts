import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
    MulterModuleOptions,
    MulterOptionsFactory
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Injectable()
export class MulterService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    const dest = process.env.DEST
    return {
      dest,
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, dest);
        },
        filename: (req, file, callback) => {
          const now = new Date();
          const fileName = file.originalname.split(' ');
          let finalName = fileName
            .join('_')
            .replace('-' || '-', '_')
            .toLowerCase();
          finalName = `${now.getFullYear()}${now.getMonth()}${now.getDate()}
                ${now.getHours()}${now.getMinutes()}${now.getSeconds()}_${now.getMilliseconds()}_${finalName}`;
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

          '.csv'
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
