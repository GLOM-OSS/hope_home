import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'error'],
    });

    this.$use(async (params, next) => {
      switch (params.action) {
        case 'findUnique': {
          if (params.model !== 'Person') {
            params.action = 'findFirst';
            params.args.where['is_deleted'] = false;
          }
          break;
        }
        case 'update': {
          params.args['data'] = this.handleDeleteInNestedObject(
            params.args['data']
          );
          break;
        }
        case 'delete': {
          params.action = 'update';
          params.args['data'] = { is_deleted: true };
          break;
        }
        case 'deleteMany': {
          params.action = 'updateMany';
          if (params.args.data) params.args.data['is_deleted'] = true;
          else params.args['data'] = { is_deleted: true };
          break;
        }
      }
      if (!['create', 'createMany', 'findUnique'].includes(params.action))
        if (params.args.where) {
          if (params.args.where.is_deleted === undefined)
            params.args.where['is_deleted'] = false;
        } else params.args['where'] = { is_deleted: false };
      const result = await next(params);
      // See results here
      return result;
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
      if (typeof obj[key] === 'object') {
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
