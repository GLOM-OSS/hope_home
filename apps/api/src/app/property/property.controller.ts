import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
}
