import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { google } from 'googleapis';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      async useFactory() {
        const oauth2 = new google.auth.OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );
        oauth2.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });
        const accessToken = await oauth2.getAccessToken();
        return {
          transport: {
            service: 'gmail',
            secure: true,
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL,
              accessToken: accessToken.token,
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
