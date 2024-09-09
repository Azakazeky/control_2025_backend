import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    Object.assign(this, LoggerPrismaClient);
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$disconnect();
    // this.$on('beforeExit', async () => {
    //   await app.close();
    // });
  }
}

export const LoggerPrismaClient = new PrismaClient().$extends({
  query: {
    $allModels: {
      $allOperations: async ({ operation, args, query, model }) => {
        Logger.log('userId', global.userId);
        var result = await query(args);
        if (
          operation === 'create' ||
          operation === 'update' ||
          operation === 'delete' ||
          operation === 'createMany' ||
          operation === 'updateMany' ||
          operation === 'deleteMany'
        ) {
          console.log(
            'operation',
            operation,
            'args',
            args,
            'model',
            model,
            'result',
            result,
          );
        }
        return result;
      },
    },
  },
});
