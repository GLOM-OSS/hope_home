import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { ResetPasswordMessages } from './messages';
import path = require('path');
// import { createTestAccount, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: Mailer) {}

  async sendResetPasswordMail(email: string, messages: ResetPasswordMessages) {
    const source = readFileSync(
      path.join(
        __dirname,
        '../../../libs/mailer/src/lib//templates/msg-reset.hbs'
      ),
      'utf8'
    );
    const template = Handlebars.compile(source);
    const mailObject = {
      to: email,
      from: 'glomexam@gmail.com',
      subject: 'Hope Home Credential',
      html: template(messages),
    };

    // if (process.env.NODE_ENV === 'production')
    return await this.mailerService.sendMail(mailObject);

    // const account = await createTestAccount();
    // console.log(account)
    // const transporter = createTransport({
    //   host: account.smtp.host,
    //   port: account.smtp.port,
    //   secure: account.smtp.secure,
    //   auth: {
    //     user: ,
    //     pass: account.pass,
    //   },
    // });
    // return await transporter.sendMail(mailObject);
  }
}
