import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Person } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateCommentDto, QueryPropertiesDto } from './property.dto';
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

  @UseGuards(JwtAuthGuard)
  @Put(':property_id/like')
  async handlePropertyLike(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    try {
      const { person_id } = request.user as Person;
      return this.propertyService.likeOrUnlike(property_id, person_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':property_id/comment')
  async commentOnProperty(
    @Req() request: Request,
    @Param('property_id') property_id: string,
    @Body() { comment }: CreateCommentDto
  ) {
    try {
      const { person_id } = request.user as Person;
      return this.propertyService.comment(property_id, comment, person_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
