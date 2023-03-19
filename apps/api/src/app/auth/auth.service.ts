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
    private oauth2Client: OAuth2Client
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
    const { email, name, locale, profile } = ticket.getPayload();
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    const newPerson: Prisma.PersonCreateInput = {
      email,
      fullname: name,
      whatsapp_number,
      profile_image_ref: profile,
      phone_number: whatsapp_number,
      preferred_lang: locale.startsWith('en')
        ? 'en'
        : locale.startsWith('fr')
        ? 'fr'
        : null,
    };
    if (person) {
      return this.prismaService.person.update({
        data: newPerson,
        where: { email },
      });
    } else return this.registerUser(newPerson);
  }

  signIn(person: Person) {
    return this.jwtService.sign({ person_id: person.person_id });
  }

  async registerUser({
    email,
    password,
    ...newPerson
  }: Prisma.PersonCreateInput) {
    return this.prismaService.person.create({
      data: {
        email,
        ...newPerson,
        password: bcrypt.hashSync(password, Number(process.env.SALT)),
      },
    });
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

  async updateProfile(person_id: string, newProfile: Prisma.PersonUpdateInput) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...person } = await this.prismaService.person.update({
      data: newProfile,
      where: { person_id },
    });
    return person;
  }
}
