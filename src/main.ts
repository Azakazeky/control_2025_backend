import { NestFactory, Reflector } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';
import { PrismaExceptionFilter } from './Common/Db/prisma.filter';
import { RolesGuard } from './Common/Guard/roles.guard';
import { AppModule } from './app.module';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { NisConvertJson } from './Common/MiddleWare/ConvertJson.middleware';
import { LoggingInterceptor } from './Common/logging.interceptor';
import helmet from '@fastify/helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
   app.enableCors({
    origin: '*',

    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });
  const firebaseConfig = {
    credential: admin.credential.cert('./nis-control-bucket.json'),
    // databaseURL: 'https://madrasa-tech.firebaseio.com',
  };
  admin.initializeApp(firebaseConfig);
  if (admin.apps.length === 0) {
    admin.initializeApp(firebaseConfig);
  } else {
    admin.app(); // Use the default app
  }
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.register(helmet);

  // app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
        description: "Enter JWT Token",
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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {}
  });
  await app.listen(3333, '0.0.0.0');
}
bootstrap();
