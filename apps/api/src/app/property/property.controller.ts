import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { QueryPropertiesDto } from './property.dto';
import { PropertyService } from './property.service';

@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get('all')
  async getProperties(@Query() queryOptions: QueryPropertiesDto) {
    return this.propertyService.findAll(queryOptions);
  }

  @Get(':property_id/details')
  async getPropertyDetails(@Param('property_id') property_id: string) {
    return this.propertyService.findOne(property_id);
  }
}
