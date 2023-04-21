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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Person } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import {
  CreateCommentDto,
  CreateNewPropertyDto,
  QueryPropertiesDto,
  UpdatePropertyDto,
} from './property.dto';
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
    return await this.propertyService.findAll(queryOptions, person?.person_id);
  }

  @Get(':property_id/details')
  async getPropertyDetails(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    const person = request.user as Person;
    return await this.propertyService.findOne(property_id, person?.person_id);
  }

  @Get(':property_id/images')
  async getPropertyImages(@Param('property_id') property_id: string) {
    return await this.propertyService.getPropertyImages(property_id);
  }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async addNewProperty(
    @Req() request: Request,
    @Body() newProperty: CreateNewPropertyDto
  ) {
    try {
      const { person_id } = request.user as Person;
      return await this.propertyService.create(newProperty, person_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':property_id/edit')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('imageRefs'))
  async updateProperty(
    @Param('property_id') property_id: string,
    @Body() updateData: UpdatePropertyDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      return await this.propertyService.update(property_id, {
        ...updateData,
        image_ref: files[0]?.filename,
        PropertyImages: {
          createMany: {
            data: files.map((_) => ({ image_ref: _.filename })),
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':property_id/delist')
  @UseGuards(JwtAuthGuard)
  async delistProperty(@Param('property_id') property_id: string) {
    try {
      return await this.propertyService.update(property_id, {
        is_listed: false,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':property_id/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProperty(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    try {
      return await this.propertyService.update(property_id, {
        is_deleted: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':property_id/like')
  async handlePropertyLike(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    try {
      const { person_id } = request.user as Person;
      return await this.propertyService.likeDislike(property_id, person_id);
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
      return await this.propertyService.comment(
        property_id,
        comment,
        person_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('comments/:comment_id/delete')
  async deleteComment(
    @Req() request: Request,
    @Param('comment_id') comment_id: string
  ) {
    try {
      const { person_id } = request.user as Person;
      return await this.propertyService.deleteComment(comment_id, person_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':property_id/flag')
  async flagProperty(
    @Req() request: Request,
    @Param('property_id') property_id: string
  ) {
    try {
      const { person_id } = request.user as Person;
      return await this.propertyService.flag(property_id, person_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('images/:property_image_id/delete')
  async deleteImage(
    @Req() request: Request,
    @Param('property_image_id') property_image_id: string
  ) {
    try {
      return await this.propertyService.deleteImage(property_image_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
