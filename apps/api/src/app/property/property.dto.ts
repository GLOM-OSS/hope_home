import { PartialType } from '@nestjs/mapped-types';
import {
  HouseTypeEnum,
  ListingReasonEnum,
  PropertyTypeEnum,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
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
  @IsNumber()
  area: number;

  @IsNumber()
  price: number;

  @IsString()
  address: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  description: string;

  @IsEnum(PropertyTypeEnum)
  property_type: PropertyTypeEnum;

  @IsEnum(ListingReasonEnum)
  listing_reason: ListingReasonEnum;

  @IsNumber()
  @IsOptional()
  number_of_rooms?: number;

  @IsNumber()
  @IsOptional()
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
export class SearchPropertiesDto {
  @IsString()
  @IsOptional()
  property_type: PropertyTypeEnum;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @Type(() => PriceInterval)
  priceInterval?: PriceInterval;

  @IsString()
  @IsOptional()
  description: string;
}
