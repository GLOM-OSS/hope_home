import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Person } from '@prisma/client';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }
  serializeUser(user: Person, done: (err, user: { person_id: string }) => void) {
    done(null, { person_id: user.person_id });
  }

  async deserializeUser(
    user: { person_id: string },
    done: (err, user: Omit<Person, 'password'>) => void
  ) {
    const deserializeUser = await this.authService.findOne(user.person_id);
    done(null, deserializeUser);
  }
}
