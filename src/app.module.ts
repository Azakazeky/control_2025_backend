import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from './Common/Db/prisma.module';
import { AuthGuard } from './Common/Guard/auth.guard';
import { RolesGuard } from './Common/Guard/roles.guard';
import { NisConvertJson } from './Common/MiddleWare/ConvertJson.middleware';
import { ActiveUserInterceptor } from './Common/active-user.interceptor';
import { LoggingInterceptor } from './Common/logging.interceptor';
import { ControlMissionModule } from './Component/Mission/control_mission/control_mission.module';
import { ExamMissionModule } from './Component/Mission/exam_mission/exam_mission.module';
import { ExamRoomsModule } from './Component/Mission/exam_rooms/exam_rooms.module';
import { GeneratePdfModule } from './Component/Mission/generate_pdf/generate_pdf.module';
import { StudentBarcodesModule } from './Component/Mission/student_barcodes/student_barcodes.module';
import { StudentSeatNumbersModule } from './Component/Mission/student_seat_numbers/student_seat_numbers.module';
import { ClassDeskModule } from './Component/School_Setting/class_desk/class_desk.module';
import { CohortModule } from './Component/School_Setting/cohort/cohort.module';
import { EducationYearModule } from './Component/School_Setting/education_year/education_year.module';
import { GradesModule } from './Component/School_Setting/grades/grades.module';
import { SchoolClassesModule } from './Component/School_Setting/school_classes/school_classes.module';
import { SchoolTypeModule } from './Component/School_Setting/school_type/school_type.module';
import { SchoolsModule } from './Component/School_Setting/schools/schools.module';
import { StageModule } from './Component/School_Setting/stage/stage.module';
import { SubjectsModule } from './Component/School_Setting/subjects/subjects.module';
import { AuthModule } from './Component/auth/auth.module';
import { GatewayModule } from './Component/event-handler/gateway.module';
import { ProctorModule } from './Component/proctor/proctor.module';
import { StudentModule } from './Component/student/student.module';
import { UuidModule } from './Component/uuid/uuid.module';
import { SystemLoggerModule } from './Users_System/system_logger/system-logger.module';
import { UserRolesSystemsModule } from './Users_System/user_roles_systems/user_roles_systems.module';
import { UsersModule } from './Users_System/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    FastifyMulterModule.register({ dest: './uploads' }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'pdfGenerateor'),
    //   serveRoot: '/pdfGenerateor',
    //   exclude: ['/swagger/(.*)'],
    // }),
    // ConfigModule.forRoot(),
    EventEmitterModule.forRoot({ global: true }),
    GatewayModule,
    PrismaModule,
    SystemLoggerModule,
    AuthModule,
    SchoolsModule,
    GradesModule,
    SchoolClassesModule,
    ClassDeskModule,
    SubjectsModule,
    CohortModule,
    StudentModule,
    UsersModule,
    ControlMissionModule,
    ExamMissionModule,
    EducationYearModule,
    StudentSeatNumbersModule,
    ExamRoomsModule,
    StudentBarcodesModule,
    UserRolesSystemsModule,
    SchoolTypeModule,
    StageModule,
    ProctorModule,
    GeneratePdfModule,
    UuidModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // AuthService,
    JwtService,
    // WebsocketGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ActiveUserInterceptor,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NisConvertJson)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // consumer.apply(fastifyStatic).forRoutes('/pdfGenerateor');
  }
}
