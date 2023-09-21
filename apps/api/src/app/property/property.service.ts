import { IHHProperty, IImage, IPropertyDetails } from '@hopehome/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LikedProperty, Person, Prisma, Property } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewPropertyDto, QueryPropertiesDto } from './property.dto';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    { is_user_property, ...query }: QueryPropertiesDto,
    person_id?: string
  ): Promise<IHHProperty[]> {
    const properties = await this.prismaService.property.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        Publisher: true,
        LikedProperties: {
          where: {
            is_deleted: false,
            ...(is_user_property ? {} : { liked_by: person_id }),
          },
        },
      },
      where: is_user_property
        ? {
            ...query,
            is_deleted: false,
            published_by: person_id,
          }
        : {
            ...query,
            is_deleted: false,
            is_flagged: false,
            is_listed: true,
          },
    });

    return this.processProperties(properties, person_id);
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
    } = await this.prismaService.property.findFirstOrThrow({
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
      where: {
        OR: [
          {
            property_id,
            is_deleted: false,
            is_flagged: false,
            is_listed: true,
          },
          {
            property_id,
            is_deleted: false,
            published_by: String(person_id),
          },
        ],
      },
    });
    return {
      ...property,
      owner_whatsapp: publisher.whatsapp_number,
      created_at: property.created_at.getTime(),
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
      house_details: {
        house_type,
        number_of_baths,
        number_of_rooms,
      },
      publisher_details: {
        ...publisher,
        created_at: created_at.getTime(),
      },
    };
  }

  async likeDislike(property_id: string, liked_by: string) {
    const likedProperty = await this.prismaService.likedProperty.findFirst({
      where: { liked_by, property_id },
    });
    return this.prismaService.likedProperty.upsert({
      create: {
        property_id,
        liked_by,
      },
      update: {
        is_deleted: !likedProperty?.is_deleted,
        deleted_at: likedProperty?.is_deleted ? null : new Date(),
      },
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
    {
      latitude,
      longitude,
      price,
      area,
      number_of_baths,
      number_of_rooms,
      ...newProperty
    }: CreateNewPropertyDto,
    files: Array<Express.Multer.File>,
    created_by: string
  ) {
    const { property_id } = await this.prismaService.property.create({
      data: {
        ...newProperty,
        price: Number(price),
        area: area ? Number(area) : null,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        number_of_baths: number_of_baths ? Number(number_of_baths) : undefined,
        number_of_rooms: number_of_rooms ? Number(number_of_rooms) : undefined,
        image_ref: files[0]?.filename,
        PropertyImages: {
          createMany: {
            data: files.map((_) => ({ image_ref: _.filename })),
          },
        },
        Publisher: { connect: { person_id: created_by } },
      },
    });
    const properties = await this.findAll({});
    return properties.find((_) => _.property_id === property_id);
  }

  async update(
    property_id: string,
    newProperty: Prisma.PropertyUpdateInput,
    audited_by: string
  ) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      property_id: _id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      created_at,
      published_by,
      ...property
    } = await this.prismaService.property.findUniqueOrThrow({
      where: { property_id },
    });
    if (published_by !== audited_by) throw new UnauthorizedException();
    return this.prismaService.property.update({
      data: {
        ...newProperty,
        PropertyAudits: {
          create: {
            ...property,
            Person: { connect: { person_id: published_by } },
          },
        },
      },
      where: { property_id },
    });
  }

  async deleteImage(property_image_id: string, audited_by: string) {
    const {
      Property: { image_ref: property_image_ref, property_id, published_by },
      image_ref,
    } = await this.prismaService.propertyImage.findUniqueOrThrow({
      select: {
        Property: {
          select: { image_ref: true, property_id: true, published_by: true },
        },
        image_ref: true,
      },
      where: { property_image_id },
    });
    if (published_by !== audited_by) throw new UnauthorizedException();
    let newImageRef: string = null;
    if (property_image_ref === image_ref) {
      const propertyImage = await this.prismaService.propertyImage.findFirst({
        where: {
          property_image_id: { not: property_image_id },
          is_deleted: false,
          property_id,
        },
      });
      if (propertyImage) newImageRef = propertyImage.image_ref;
    }
    await this.prismaService.propertyImage.update({
      data: {
        is_deleted: true,
        deleted_at: new Date(),
        Property: { update: { image_ref: newImageRef } },
      },
      where: { property_image_id },
    });
  }

  async getPropertyImages(property_id: string): Promise<IImage[]> {
    const propertyImages = await this.prismaService.propertyImage.findMany({
      select: { property_image_id: true, image_ref: true },
      where: { property_id, is_deleted: false },
    });
    return propertyImages.map(({ property_image_id: image_id, image_ref }) => ({
      image_id,
      image_ref,
    }));
  }

  async searchProperties(keywords: string) {
    const properties = await this.prismaService.property.findMany({
      include: {
        Publisher: true,
        LikedProperties: {
          where: { is_deleted: false },
        },
      },
      where: {
        is_deleted: false,
        is_flagged: false,
        is_listed: true,
        ...(keywords
          ? {
              address: { search: keywords },
              description: { search: keywords },
              owner_whatsapp: { search: keywords },
            }
          : {}),
      },
    });
    return this.processProperties(properties);
  }

  private processProperties(
    properties: (Property & {
      Publisher: Person;
      LikedProperties: LikedProperty[];
    })[],
    person_id?: string
  ): IHHProperty[] {
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
        owner_whatsapp: publisher.whatsapp_number,
        created_at: property.created_at.getTime(),
        number_of_likes: LikedProperties.length,
        house_details: {
          house_type,
          number_of_baths,
          number_of_rooms,
        },
        is_liked: person_id
          ? Boolean(LikedProperties.find((_) => _.liked_by === person_id))
          : null,
        publisher_details: {
          ...publisher,
          created_at: created_at.getTime(),
        },
      })
    );
  }
}
