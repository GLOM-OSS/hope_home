import { PartialType } from '@nestjs/mapped-types';
import {
  HouseTypeEnum,
  ListingReasonEnum,
  PropertyTypeEnum,
} from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsUUID()
  @IsOptional()
  published_by?: string;
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
  type?: HouseTypeEnum;
}

export class UpdatePropertyDto extends PartialType(CreateNewPropertyDto) {}
