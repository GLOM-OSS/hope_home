import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { decrypt, encrypt } from '@hopehome/encrypter';
import { Request } from 'express';

@Injectable()
export class AppInterceptor<T> implements NestInterceptor<T, string> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    if (typeof request.params.data === 'string') {
      // console.log('request.params...');
      request.params = decrypt(request.params.data);
    }
    if (typeof request.body.data === 'string') {
      // console.log('request.body...');
      request.body = decrypt(request.body.data);
    }
    if (typeof request.query.data === 'string') {
      // console.log('request.query...');
      request.query = decrypt(request.query['data'] as string);
    }

    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object') {
          data = encrypt(data);
        }
        return data;
      })
    );
  }
}
