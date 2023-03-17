import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Person } from '@prisma/client';
import { Request } from 'express';
import { QueryPropertiesDto } from './property.dto';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get('all')
  async getProperties(
    @Req() request: Request,
    @Query() queryOptions: QueryPropertiesDto
  ) {
    const person = request.user as Person;
    return this.propertyService.findAll(queryOptions, person?.person_id);
  }

  @Get(':property_id/details')
  async getPropertyDetails(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    const person = request.user as Person;
    return this.propertyService.findOne(property_id, person?.person_id);
  }
}
