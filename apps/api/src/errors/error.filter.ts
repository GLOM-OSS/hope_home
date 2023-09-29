import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appErros } from '.';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const response = exception.getResponse();
    const statusCode = response['statusCode'];
    const lang =
      req.user?.['preferred_lang'] ?? req.get('preferred_lang') ?? 'fr';

    const error = appErros.find((_) =>
      response.toString().includes(_.code.toString())
    );
    const status = statusCode ?? exception.getStatus();
    const errorMessage =
      error?.message[lang === 'en' ? 'en' : 'fr'] ?? //custom messages
      response['message'] ?? //nest messages
      //prisma errors messages
      (response as string)
        .split('\n')
        .reduce(
          (str, cStr, i) =>
            i < (response as string).split('\n').indexOf('{') ||
            i > (response as string).split('\n').lastIndexOf('}')
              ? str.concat(cStr)
              : str,
          ''
        );
    return resp.status(status).json({
      status,
      path: req.url,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
