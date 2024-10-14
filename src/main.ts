import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './Common/Db/prisma.filter';
const helmet = require('@fastify/helmet');

declare const module: any;
/**
 * Bootstrap the application.
 *
 * @remarks
 * This is the main function responsible for
 * setting up the application.
 *
 * @returns {Promise<void>}
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /**
   * Enable cors for all requests
   *
   * @remarks
   * This is necessary for the swagger ui to work
   * when the api is deployed on a different domain
   * than the swagger ui.
   */
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });

  /**
   * Initialize the Firebase app
   *
   * @remarks
   * This is necessary for the authentication to work
   * using the Firebase Admin SDK.
   */
  const firebaseConfig = {
    credential: admin.credential.cert('./nis-control-bucket.json'),
  };
  admin.initializeApp(firebaseConfig);
  if (admin.apps.length === 0) {
    admin.initializeApp(firebaseConfig);
  } else {
    admin.app(); // Use the default app
  }

  /**
   * Register the global filter for Prisma errors
   *
   * @remarks
   * This is necessary to catch and handle Prisma
   * errors.
   */
  app.useGlobalFilters(new PrismaExceptionFilter());

  /**
   * Register the helmet middleware
   *
   * @remarks
   * This is necessary to secure the API by
   * setting various HTTP headers.
   */
  await app.register(helmet);

  /**
   * Set the body parser options
   *
   * @remarks
   * This is necessary to allow the API to accept
   * large JSON payloads.
   */
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * Set the swagger configuration
   *
   * @remarks
   * This is necessary to allow the swagger ui to
   * work.
   */
  const config = new DocumentBuilder()
    .setTitle('NIS-Control Api System')
    .setDescription('The NIS-Control API description')
    .setVersion('1.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'authorization',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT',
    )
    .addSecurityRequirements('JWT')
    .addTag('Users')
    .addTag('Generate-PDF')
    .addTag('Roles-System')
    .addTag('School & Grades')
    .addTag('cohort')
    .addTag('Subject')
    .addTag('Students')
    .addTag('Class-Desk')
    .addTag('Education-Years')
    .addTag('School-Classes')
    .addTag('School-Type')
    .addTag('Control-Mission')
    .addTag('Exam-Mission')
    .addTag('Exam-Room')
    .addTag('Student-Barcodes')
    .addTag('student-seat-numbers')
    .addTag('User-Roles-Systems')
    .addTag('Controllers')
    .addTag('Uuid')
    .build();

  /**
   * Set up the swagger ui
   *
   * @remarks
   * This is necessary to allow the swagger ui to
   * work.
   */
  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {},
    });
  }

  /**
   * Start the server
   *
   * @remarks
   * This is necessary to start the server and
   * make it listen on port 80.
   */
  await app.listen(80, '0.0.0.0');

  /**
   * Set up the hot reloading
   *
   * @remarks
   * This is necessary to make the hot reloading
   * work.
   */
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
