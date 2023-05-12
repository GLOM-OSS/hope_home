import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ErrorEnum } from 'apps/api/src/errors';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new HttpException(ErrorEnum.ERR5, HttpStatus.UNAUTHORIZED);
    return user;
  }
}
