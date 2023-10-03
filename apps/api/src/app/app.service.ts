import { Injectable } from '@nestjs/common';
import { CreateMessage } from './app.dto';
import { MailService, contactUsMessages } from '@hopehome/mailer';
import { Lang } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private mailService: MailService) {}
  async getData() {
    return {
      message: `Welcome to api!`,
    };
  }

  sendMessage({ email, message, name }: CreateMessage, lang: Lang) {
    const { messageDisclaimer, reponseTo, subject } = contactUsMessages;
    return this.mailService.sendContactUsMail({
      email,
      message,
      subject: subject[lang],
      responseTo: reponseTo[lang],
      messageDisclaimer: messageDisclaimer(name)[lang],
      logo: 'https://hopehome.app/favicon_green.png',
    });
  }
}
