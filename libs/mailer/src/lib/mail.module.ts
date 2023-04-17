import { MailerModule,  } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport:
        process.env.NODE_ENV === 'production'
          ? {
              host: process.env.EMAIL_HOST,
              secure: true,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            }
          : {
              host: 'smtp.ethereal.email',
              port: 587,
              auth: {
                user: 'etpehxcizjyxxumf@ethereal.email',
                pass: 'aUxN481pSdafvvjcMe',
              },
            },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
