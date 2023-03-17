import {
  HouseTypeEnum,
  ListingReasonEnum,
  PropertyTypeEnum,
} from '@prisma/client';
import {
  IsEnum,
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
