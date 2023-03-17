import { Lang } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  token: string;

  @IsPhoneNumber('CM')
  whatsapp_number: string;
}

export class CreatePersonDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  password: string;

  @IsPhoneNumber('CM')
  whatsapp_number: string;

  @IsEnum(Lang)
  @IsOptional()
  preferred_lang?: Lang;
}
