import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Person } from '@prisma/client';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private userService: AuthService) {
    super();
  }
  serializeUser(user: Person, done: (err, user: { login_id: string }) => void) {
    done(null, { login_id: user.person_id });
  }

  async deserializeUser(
    user: { login_id: string },
    done: (err, user: Omit<Person, 'password'>) => void
  ) {
    const deserializeUser = await this.userService.findOne(user.login_id);
    done(null, deserializeUser);
  }
}
