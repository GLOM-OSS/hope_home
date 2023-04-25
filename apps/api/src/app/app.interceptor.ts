import { encrypt } from '@hopehome/encrypter';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class AppInterceptor<T> implements NestInterceptor<T, string> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
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
