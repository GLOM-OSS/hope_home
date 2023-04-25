import {
  MailService,
  ResetPasswordMessages,
  resetPasswordMessages,
} from '@hopehome/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Person, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewPasswordDto, GoogleLoginDto } from './auth.dto';
import { IUser } from '@hopehome/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private oauth2Client: OAuth2Client,
    private mailService: MailService
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (person && bcrypt.compareSync(password, person.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, created_at, ...user } = person;
      return { ...user, created_at: created_at.getTime() };
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

  async generateNewPassword(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, person_id, ...personData } =
      await this.prismaService.person.findUniqueOrThrow({
        where: { email },
      });
    const newPassword = Math.random().toString(36).split('.')[1].toUpperCase();
    await this.prismaService.person.update({
      data: {
        password: bcrypt.hashSync(newPassword, Number(process.env.SALT)),
        PersonAudits: { create: personData },
      },
      where: { person_id },
    });
    const { fullname, preferred_lang: lang } = personData;
    const { resetPasswordSubTitle, resetPasswordObject, ...messages } =
      resetPasswordMessages;
    const message = await this.mailService.sendResetPasswordMail(email, {
      connexion: 'https://hopehome.ingl.io/',
      ...Object.keys(messages).reduce(
        (messages, key) => ({
          ...messages,
          [key]: resetPasswordMessages[key][
            personData.preferred_lang
          ] as string,
        }),
        {} as ResetPasswordMessages
      ),
      resetPasswordObject: resetPasswordObject(newPassword)[lang],
      resetPasswordSubTitle: resetPasswordSubTitle(fullname)[lang],
    });
    Logger.verbose(
      `Reset password email sent successfully. Message ID: ${message?.messageId}`,
      AuthService.name
    );
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
      await this.prismaService.resetPassword.findFirstOrThrow({
        where: {
          used_at: null,
          reset_password_id,
          expires_at: { gte: new Date() },
        },
      });
    await this.prismaService.person.update({
      data: {
        password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
        ResetPasswords: {
          update: {
            data: { used_at: new Date() },
            where: { reset_password_id },
          },
        },
      },
      where: { person_id: reset_by },
    });
  }

  async updateProfile(
    personId: string,
    { password: newPassword, ...newProfile }: Prisma.PersonUpdateInput
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, person_id, ...personAudit } =
      await this.prismaService.person.findUniqueOrThrow({
        where: { person_id: personId },
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...person } = await this.prismaService.person.update({
      data: {
        ...newProfile,
        password: newPassword
          ? bcrypt.hashSync(newPassword as string, Number(process.env.SALT))
          : undefined,
        PersonAudits: {
          create: {
            ...personAudit,
          },
        },
      },
      where: { person_id },
    });
    return person;
  }
}
