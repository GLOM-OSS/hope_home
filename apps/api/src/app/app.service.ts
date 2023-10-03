import { Injectable } from '@nestjs/common';
import { CreateMessage } from './app.dto';
import { MailService, contactUsMessages } from '@hopehome/mailer';
import { Lang } from '@prisma/client';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class AppService {
  constructor(
    private mailService: MailService,
    @InjectRedis() private readonly redisService: Redis
  ) {}
  async getData() {
    let visitCount: number = (await this.redisService.get('count')) ?? 1;
    console.log(visitCount);
    this.redisService.set('count', ++visitCount);
    return {
      message: `Welcome to api! We have accumulated ${visitCount} visits so far.`,
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
