import { IMessage } from '@hopehome/interfaces';
import { IsEmail, IsString } from 'class-validator';

export class CreateMessage implements IMessage {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  message: string;
}
