import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: ['query', 'info', 'warn', 'error'] });
    this.$extends({
      name: 'logger',
      query: {
        $allModels: {
          $allOperations: async ({ operation, args, query, model }) => {
            var result = await query(args);
            console.log(
              'operation',
              operation,
              'args',
              args,
              'query',
              query,
              'model',
              model,
              'result',
              result,
            );
            return result;
          },
        },
      },
    });
  }

  async onModuleInit() {
    // Register Prisma event handlers

    // this.$extends({
    //   name: 'test',
    //   query: {
    //     $allModels: {
    //       $allOperations: async ({ operation, args, query, model }) => {
    //         var result = await query(args);
    //         console.log(
    //           'operation',
    //           operation,
    //           'args',
    //           args,
    //           'query',
    //           query,
    //           'model',
    //           model,
    //           'result',
    //           result,
    //         );

    //         return result;
    //       },
    //     },
    //   },
    // });

    await this.$connect();

    // this.$use(async (params, next) => {
    //   const result = await next(params);
    //   console.log('Query Result: ', result);
    //   return result;
    // });
  }

  private logMiddleware: Prisma.Middleware = async (params, next) => {
    // Log query details before execution
    console.log('Query:', params);

    // Execute the query
    const result = await next(params);

    // Log query result after execution
    console.log('Result:', result);

    return result;
  };

  async enableShutdownHooks(app: INestApplication) {
    this.$disconnect();
    // this.$on('beforeExit', async () => {
    //   await app.close();
    // });
  }
}
