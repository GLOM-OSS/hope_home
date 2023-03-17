import { Gender, Lang } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
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
  fullname: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsString()
  password: string;

  @IsPhoneNumber('CM')
  phone_number: string;

  @IsPhoneNumber('CM')
  whatsapp_number: string;

  @IsEnum(Lang)
  @IsOptional()
  preferred_lang?: Lang;
}

export class CreateNewPasswordDto {
  @IsUUID()
  reset_password_id: string;

  @IsString()
  new_password: string;
}
