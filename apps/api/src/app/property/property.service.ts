import { IHHProperty, IPropertyDetails } from '@hopehome/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPropertiesDto } from './property.dto';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    { house_type, ...query }: QueryPropertiesDto,
    person_id?: string
  ): Promise<IHHProperty[]> {
    const properties = await this.prismaService.property.findMany({
      include: {
        HouseDetail: true,
        Publisher: true,
        LikedProperties: true,
      },
      where: { is_flagged: false, ...query, HouseDetail: { type: house_type } },
    });

    return properties.map(
      ({
        LikedProperties,
        HouseDetail: { number_of_baths, number_of_rooms, type },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Publisher: { password, created_at, ...publisher },
        ...property
      }) => ({
        ...property,
        number_of_likes: LikedProperties.length,
        house_details: {
          number_of_baths,
          number_of_rooms,
          type,
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
      HouseDetail: { number_of_baths, number_of_rooms, type },
      PropertyImages,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Publisher: { password, created_at, ...publisher },
      ...property
    } = await this.prismaService.property.findUniqueOrThrow({
      include: {
        LikedProperties: true,
        HouseDetail: true,
        Publisher: true,
        Comments: {
          select: { comment: true, Person: true },
        },
        PropertyImages: true,
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
      house_details: { number_of_baths, number_of_rooms, type },
      publisher_details: {
        ...publisher,
        created_at: created_at.getTime(),
      },
    };
  }
}
