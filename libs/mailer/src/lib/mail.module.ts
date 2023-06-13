import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Logger, Module } from '@nestjs/common';
import { google } from 'googleapis';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      async useFactory() {
        Logger.debug(process.env.CLIENT_ID, MailModule.name);
        Logger.debug(process.env.CLIENT_SECRET, MailModule.name);
        const oauth2 = new google.auth.OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );
        oauth2.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });
        const accessToken = await new Promise<string>((resolve) =>
          oauth2.getAccessToken((err, token) => {
            if (err) Logger.error(err, MailModule.name);
            resolve(token);
          })
        );
        return {
          transport: {
            service: 'gmail',
            secure: true,
            auth: {
              accessToken,
              type: 'OAuth2',
              user: process.env.EMAIL,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
