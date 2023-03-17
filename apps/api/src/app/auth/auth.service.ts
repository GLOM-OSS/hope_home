import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Person, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewPasswordDto, GoogleLoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET
    )
  ) {}

  async validateUser(email: string, password: string) {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (person && bcrypt.compareSync(person.password, password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = person;
      return user;
    }
    return null;
  }

  async googleSignIn({ token, whatsapp_number }: GoogleLoginDto) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, family_name, given_name, locale } = ticket.getPayload();
    return this.registerUser({
      email,
      whatsapp_number,
      first_name: family_name,
      last_name: given_name,
      preferred_lang: locale.startsWith('en')
        ? 'en'
        : locale.startsWith('fr')
        ? 'fr'
        : null,
    });
  }

  signIn(person: Person) {
    return this.jwtService.sign({ person_id: person.person_id });
  }

  async registerUser({ email, ...newPerson }: Prisma.PersonCreateInput) {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (person) {
      return this.prismaService.person.update({
        data: newPerson,
        where: { email },
      });
    } else {
      return this.prismaService.person.create({
        data: { email, ...newPerson },
      });
    }
  }

  async resetPassword(email: string) {
    const person = await this.prismaService.person.findUniqueOrThrow({
      where: { email },
    });
    const { reset_password_id, expires_at } =
      await this.prismaService.resetPassword.create({
        data: {
          Person: { connect: { person_id: person.person_id } },
          expires_at: new Date(Date.now() + 6 * 3600 * 1000),
        },
      });
    //TODO email user.
    console.log(
      `User reset password link id ${reset_password_id} and expiration time ${expires_at}`
    );
  }

  async setNewPassword({
    new_password,
    reset_password_id,
  }: CreateNewPasswordDto) {
    const { reset_by } =
      await this.prismaService.resetPassword.findUniqueOrThrow({
        where: { reset_password_id },
      });
    await this.prismaService.person.update({
      data: {
        password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
      },
      where: { person_id: reset_by },
    });
  }
}
