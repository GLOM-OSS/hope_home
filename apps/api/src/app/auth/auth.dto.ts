import { Gender, Lang } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class GoogleLoginDto {
  @IsString()
  token: string;

  @IsPhoneNumber('CM')
  @IsOptional()
  whatsapp_number?: string;
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

export class EditPersonDto extends PartialType(CreatePersonDto) {}

export class CreateNewPasswordDto {
  @IsUUID()
  reset_password_id: string;

  @IsString()
  new_password: string;
}

export class ChangePasswordDto {
  @IsString()
  new_password: string;
  
  @IsString()
  current_password: string;
}
