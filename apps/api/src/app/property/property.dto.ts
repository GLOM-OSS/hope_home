import { PartialType } from '@nestjs/mapped-types';
import {
  HouseTypeEnum,
  ListingReasonEnum,
  PropertyTypeEnum,
} from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryPropertiesDto {
  @IsOptional()
  @IsEnum(PropertyTypeEnum)
  property_type?: PropertyTypeEnum;

  @IsOptional()
  @IsEnum(ListingReasonEnum)
  listing_reason?: ListingReasonEnum;

  @IsOptional()
  @IsEnum(HouseTypeEnum)
  house_type?: HouseTypeEnum;

  @IsBoolean()
  @IsOptional()
  is_user_property?: boolean;
}

export class CreateCommentDto {
  @IsString()
  @MaxLength(199)
  comment: string;
}

export class CreateNewPropertyDto {
  @IsOptional()
  @IsNumberString()
  area?: number;

  @IsNumberString()
  price: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumberString()
  latitude?: number;

  @IsOptional()
  @IsNumberString()
  longitude?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsPhoneNumber()
  owner_whatsapp?: string;

  @IsEnum(PropertyTypeEnum)
  property_type: PropertyTypeEnum;

  @IsEnum(ListingReasonEnum)
  listing_reason: ListingReasonEnum;

  @IsOptional()
  @IsNumberString()
  number_of_rooms?: number;

  @IsOptional()
  @IsNumberString()
  number_of_baths?: number;

  @IsOptional()
  @IsEnum(HouseTypeEnum)
  house_type?: HouseTypeEnum;
}

export class UpdatePropertyDto extends PartialType(CreateNewPropertyDto) {}

export class PriceInterval {
  @IsNumber()
  @IsOptional()
  lower_bound?: number;

  @IsNumber()
  @IsOptional()
  upper_bound?: number;
}