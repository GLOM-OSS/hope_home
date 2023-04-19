import { IUser } from '@hopehome/interfaces';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

interface IJwtData {
  person_id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private pismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate({ person_id }: IJwtData): Promise<IUser | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, created_at, ...user } =
      await this.pismaService.person.findUnique({
        where: { person_id },
      });
    return { ...user, created_at: created_at.getTime() };
  }
}
