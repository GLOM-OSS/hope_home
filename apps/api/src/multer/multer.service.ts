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
    const destPath = path.join(__dirname, './assets/uploads/');
    return {
      dest: destPath,
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, destPath);
        },
        filename: (req, file, callback) => {
          const now = new Date();
          let fileName = file.originalname.split('.')[0];
          const ext = path.extname(file.originalname).toLowerCase();

          const formalName = fileName
            .replace(/[^a-zA-Z0-9]/g, '_')
            .toLowerCase();
          fileName = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}_${formalName}`;
          const avaibleNumberOfCharacters = 255 - ext.length;
          fileName = fileName.slice(0, avaibleNumberOfCharacters);
          callback(null, fileName.concat(ext));
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
