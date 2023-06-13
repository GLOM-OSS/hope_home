import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private handleDeleteInNestedObject<T>(obj: T): T {
    const newObj: T = obj;
    Object.keys(obj).forEach((key: string) => {
      const value = obj[key];
      if (value && typeof value === 'object') {
        return this.handleDeleteInNestedObject(obj[key]);
      } else if (['delete', 'deleteMany'].includes(key)) {
        newObj['updateMany'] = {
          data: { is_deleted: true },
          where: newObj['deleteMany'],
        };
        delete newObj['deleteMany'];
      }
    });
    return newObj;
  }
}
