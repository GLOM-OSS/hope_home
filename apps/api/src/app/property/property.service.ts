import { IHHProperty } from '@hopehome/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPropertiesDto } from './property.dto';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    house_type,
    ...query
  }: QueryPropertiesDto): Promise<IHHProperty[]> {
    const properties = await this.prismaService.property.findMany({
      include: { HouseDetail: true, Publisher: true },
      where: { ...query, HouseDetail: { type: house_type } },
    });

    return properties.map(
      ({
        HouseDetail: { number_of_baths, number_of_rooms, type },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Publisher: { password, created_at, ...publisher },
        ...property
      }) => ({
        ...property,
        house_details: {
          number_of_baths,
          number_of_rooms,
          type,
        },
        publisher_details: {
          ...publisher,
          created_at: created_at.getTime(),
        },
      })
    );
  }
}
