import { IHHProperty, IPropertyDetails } from '@hopehome/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewPropertyDto, QueryPropertiesDto } from './property.dto';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    query: QueryPropertiesDto,
    person_id?: string
  ): Promise<IHHProperty[]> {
    const properties = await this.prismaService.property.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        Publisher: true,
        LikedProperties: {
          where: { is_deleted: false },
        },
      },
      where: { is_flagged: false, ...query },
    });

    return properties.map(
      ({
        LikedProperties,
        number_of_baths,
        number_of_rooms,
        house_type,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Publisher: { password, created_at, ...publisher },
        ...property
      }) => ({
        ...property,
        number_of_likes: LikedProperties.length,
        house_details: {
          number_of_baths,
          number_of_rooms,
          type: house_type,
        },
        is_liked: Boolean(
          LikedProperties.find((_) => _.liked_by === person_id)
        ),
        publisher_details: {
          ...publisher,
          created_at: created_at.getTime(),
        },
      })
    );
  }

  async findOne(
    property_id: string,
    person_id?: string
  ): Promise<IPropertyDetails> {
    const {
      Comments,
      LikedProperties,
      number_of_baths,
      number_of_rooms,
      house_type,
      PropertyImages,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Publisher: { password, created_at, ...publisher },
      ...property
    } = await this.prismaService.property.findUniqueOrThrow({
      include: {
        LikedProperties: {
          where: { is_deleted: false },
        },
        Publisher: true,
        Comments: {
          select: { comment: true, Person: true },
        },
        PropertyImages: {
          where: { is_deleted: false },
        },
      },
      where: { property_id },
    });
    return {
      ...property,
      number_of_likes: LikedProperties.length,
      comments: Comments.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ comment, Person: { password, created_at, ...publisher } }) => ({
          comment,
          publisher: {
            ...publisher,
            created_at: created_at.getTime(),
          },
        })
      ),
      is_liked: Boolean(LikedProperties.find((_) => _.liked_by === person_id)),
      image_refs: PropertyImages.map(({ property_image_id, image_ref }) => ({
        image_id: property_image_id,
        image_ref,
      })),
      house_details: { number_of_baths, number_of_rooms, type: house_type },
      publisher_details: {
        ...publisher,
        created_at: created_at.getTime(),
      },
    };
  }

  async likeOrUnlike(property_id: string, liked_by: string) {
    return this.prismaService.likedProperty.upsert({
      create: {
        Property: { connect: { property_id } },
        Person: { connect: { person_id: liked_by } },
      },
      update: { deleted_at: new Date(), is_deleted: true },
      where: { liked_by_property_id: { liked_by, property_id } },
    });
  }

  async comment(property_id: string, comment: string, commented_by: string) {
    return this.prismaService.comment.create({
      data: {
        comment,
        Property: { connect: { property_id } },
        Person: { connect: { person_id: commented_by } },
      },
    });
  }

  async deleteComment(comment_id: string, deleted_by: string) {
    await this.prismaService.comment.update({
      data: {
        deleted_at: new Date(),
        is_deleted: true,
        DeletedBy: { connect: { person_id: deleted_by } },
      },
      where: { comment_id },
    });
  }

  async flag(property_id: string, flag_by: string) {
    const numberOfFlags = await this.prismaService.flagProperty.count({
      where: { property_id, flag_by },
    });
    if (numberOfFlags > 2) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        property_id: _id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        created_at,
        ...property
      } = await this.prismaService.property.findUniqueOrThrow({
        where: { property_id },
      });
      return this.prismaService.$transaction([
        this.prismaService.flagProperty.create({
          data: {
            Property: { connect: { property_id } },
            Person: { connect: { person_id: flag_by } },
          },
        }),
        this.prismaService.property.update({
          data: {
            is_flagged: true,
            PropertyAudits: {
              create: {
                ...property,
                audited_by: flag_by,
              },
            },
          },
          where: { property_id },
        }),
      ]);
    }
    return this.prismaService.flagProperty.create({
      data: {
        Property: { connect: { property_id } },
        Person: { connect: { person_id: flag_by } },
      },
    });
  }

  async create(
    { type, ...newProperty }: CreateNewPropertyDto,
    files: Array<Express.Multer.File>,
    created_by: string
  ) {
    return this.prismaService.property.create({
      data: {
        ...newProperty,
        house_type: type,
        image_ref: files[0].filename,
        Publisher: { connect: { person_id: created_by } },
        PropertyImages: {
          createMany: {
            data: files.map((_) => ({ image_ref: _.filename })),
          },
        },
        //TODO fetch it from an API
        latitude: 0,
        longitude: 0,
      },
    });
  }

  async update(
    property_id: string,
    newProperty: Prisma.PropertyUpdateInput,
    files: Array<Express.Multer.File>,
    audited_by: string
  ) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      property_id: _id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      created_at,
      ...property
    } = await this.prismaService.property.findUniqueOrThrow({
      where: { property_id },
    });
    return this.prismaService.property.update({
      data: {
        ...newProperty,
        PropertyAudits: {
          create: {
            ...property,
            audited_by,
          },
        },
        PropertyImages: {
          createMany: {
            data: files.map((_) => ({ image_ref: _.filename })),
          },
        },
      },
      where: { property_id },
    });
  }

  async deleteImage(property_image_id: string, deleted_by: string) {
    await this.prismaService.propertyImage.findUniqueOrThrow({
      where: { property_image_id },
    });
    await this.prismaService.propertyImage.updateMany({
      data: { is_deleted: true },
      where: { property_image_id, Property: { published_by: deleted_by } },
    });
  }

  async getPropertyImages(property_id: string) {
    const propertyImages = await this.prismaService.propertyImage.findMany({
      select: { property_image_id: true, image_ref: true },
      where: { property_id },
    });
    return propertyImages.map(({ property_image_id: image_id, image_ref }) => ({
      image_id,
      image_ref,
    }));
  }
}
