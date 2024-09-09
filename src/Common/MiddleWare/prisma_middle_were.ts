// import { PrismaClient } from '@prisma/client';

// // Initialize Prisma Client
// const prisma = new PrismaClient().$extends({
//   query: {
//     $queryRaw: async ({ args, query, operation }) => {
//       // handle $queryRaw operation
//       console.log('args', args, 'query', query, 'operation', operation);
//       var result = await query(args);
//       console.log('result', result);
//       return result;
//     },
//     $executeRaw: async ({ args, query, operation }) => {
//       // handle $executeRaw operation
//       console.log('args', args, 'query', query, 'operation', operation);
//       var result = await query(args);
//       console.log('result', result);

//       return result;
//     },
//     $queryRawUnsafe: async ({ args, query, operation }) => {
//       // handle $queryRawUnsafe operation
//       console.log('args', args, 'query', query, 'operation', operation);
//       var result = await query(args);
//       console.log('result', result);

//       return result;
//     },
//     $executeRawUnsafe: async ({ args, query, operation }) => {
//       // handle $executeRawUnsafe operation
//       console.log('args', args, 'query', query, 'operation', operation);
//       var result = await query(args);
//       console.log('result', result);
//       return result;
//     },
//   },

//   // Add your custom middleware here
// });

// export { prisma };
