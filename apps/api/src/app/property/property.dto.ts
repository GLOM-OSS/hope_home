import {
  HouseTypeEnum,
  ListingReasonEnum,
  PropertyTypeEnum,
} from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

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
}
