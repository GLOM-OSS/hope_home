import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { ContactUsMessages, ResetPasswordMessages } from './messages';
import path = require('path');

@Injectable()
export class MailService {
  constructor(private readonly mailerService: Mailer) {}

  async sendResetPasswordMail(email: string, messages: ResetPasswordMessages) {
    const source = readFileSync(
      path.join(__dirname, './assets/templates/msg-reset.hbs'),
      'utf8'
    );
    const template = Handlebars.compile(source);
    const mailObject = {
      to: email,
      from: process.env.EMAIL,
      subject: 'Hope Home Credential',
      html: template(messages),
    };

    return await this.mailerService.sendMail(mailObject);
  }

  async sendContactUsMail(messages: ContactUsMessages) {
    const source = readFileSync(
      path.join(__dirname, './assets/templates/contact-us.hbs'),
      'utf8'
    );
    const template = Handlebars.compile(source);
    const mailObject = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Service Clientèles, Hope Home',
      html: template(messages),
    };

    return await this.mailerService.sendMail(mailObject);
  }
}
