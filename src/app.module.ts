import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { ProctorModule } from './Component/proctor/proctor.module';
import { StudentModule } from './Component/student/student.module';
import { UuidModule } from './Component/uuid/uuid.module';
import { SystemLoggerModule } from './Users_System/system_logger/system-logger.module';
import { UserRolesSystemsModule } from './Users_System/user_roles_systems/user_roles_systems.module';
import { UsersModule } from './Users_System/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * The main module of the application.
 *
 * This module contains all the other modules of the application and
 * defines the global configuration of the application.
 */
@Module({
  /**
   * The imports of the module.
   *
   * This property defines the modules that are imported by this module.
   */
  imports: [
    /**
     * The FastifyMulterModule is used to handle the upload of files.
     *
     * The files are stored in the 'uploads' directory.
     */
    FastifyMulterModule.register({ dest: './uploads' }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'pdfGenerateor'),
    //   serveRoot: '/pdfGenerateor',
    //   exclude: ['/swagger/(.*)'],
    // }),
    // ConfigModule.forRoot(),
    /**
     * The PrismaModule is used to connect to the database.
     *
     * The PrismaModule is used to create a PrismaClient instance that is
     * used to interact with the database.
     */
    PrismaModule,
    /**
     * The SystemLoggerModule is used to log the system events.
     *
     * The SystemLoggerModule is used to log the system events such as the
     * startup and shutdown of the application.
     */
    SystemLoggerModule,
    /**
     * The AuthModule is used to handle the authentication of the users.
     *
     * The AuthModule is used to handle the authentication of the users and
     * to provide the necessary services to the application.
     */
    AuthModule,
    /**
     * The SchoolsModule is used to handle the schools.
     *
     * The SchoolsModule is used to handle the schools and to provide the
     * necessary services to the application.
     */
    SchoolsModule,
    /**
     * The GradesModule is used to handle the grades.
     *
     * The GradesModule is used to handle the grades and to provide the
     * necessary services to the application.
     */
    GradesModule,
    /**
     * The SchoolClassesModule is used to handle the school classes.
     *
     * The SchoolClassesModule is used to handle the school classes and to
     * provide the necessary services to the application.
     */
    SchoolClassesModule,
    /**
     * The ClassDeskModule is used to handle the class desks.
     *
     * The ClassDeskModule is used to handle the class desks and to provide
     * the necessary services to the application.
     */
    ClassDeskModule,
    /**
     * The SubjectsModule is used to handle the subjects.
     *
     * The SubjectsModule is used to handle the subjects and to provide the
     * necessary services to the application.
     */
    SubjectsModule,
    /**
     * The CohortModule is used to handle the cohorts.
     *
     * The CohortModule is used to handle the cohorts and to provide the
     * necessary services to the application.
     */
    CohortModule,
    /**
     * The StudentModule is used to handle the students.
     *
     * The StudentModule is used to handle the students and to provide the
     * necessary services to the application.
     */
    StudentModule,
    /**
     * The UsersModule is used to handle the users.
     *
     * The UsersModule is used to handle the users and to provide the
     * necessary services to the application.
     */
    UsersModule,
    /**
     * The ControlMissionModule is used to handle the control missions.
     *
     * The ControlMissionModule is used to handle the control missions and
     * to provide the necessary services to the application.
     */
    ControlMissionModule,
    /**
     * The ExamMissionModule is used to handle the exam missions.
     *
     * The ExamMissionModule is used to handle the exam missions and to
     * provide the necessary services to the application.
     */
    ExamMissionModule,
    /**
     * The EducationYearModule is used to handle the education years.
     *
     * The EducationYearModule is used to handle the education years and to
     * provide the necessary services to the application.
     */
    EducationYearModule,
    /**
     * The StudentSeatNumbersModule is used to handle the student seat numbers.
     *
     * The StudentSeatNumbersModule is used to handle the student seat numbers
     * and to provide the necessary services to the application.
     */
    StudentSeatNumbersModule,
    /**
     * The ExamRoomsModule is used to handle the exam rooms.
     *
     * The ExamRoomsModule is used to handle the exam rooms and to provide the
     * necessary services to the application.
     */
    ExamRoomsModule,
    /**
     * The StudentBarcodesModule is used to handle the student barcodes.
     *
     * The StudentBarcodesModule is used to handle the student barcodes and to
     * provide the necessary services to the application.
     */
    StudentBarcodesModule,
    /**
     * The UserRolesSystemsModule is used to handle the user roles systems.
     *
     * The UserRolesSystemsModule is used to handle the user roles systems and
     * to provide the necessary services to the application.
     */
    UserRolesSystemsModule,
    /**
     * The SchoolTypeModule is used to handle the school types.
     *
     * The SchoolTypeModule is used to handle the school types and to provide
     * the necessary services to the application.
     */
    SchoolTypeModule,
    /**
     * The StageModule is used to handle the stages.
     *
     * The StageModule is used to handle the stages and to provide the
     * necessary services to the application.
     */
    StageModule,
    /**
     * The ProctorModule is used to handle the proctors.
     *
     * The ProctorModule is used to handle the proctors and to provide the
     * necessary services to the application.
     */
    ProctorModule,
    /**
     * The GeneratePdfModule is used to generate PDFs.
     *
     * The GeneratePdfModule is used to generate PDFs and to provide the
     * necessary services to the application.
     */
    GeneratePdfModule,
    /**
     * The UuidModule is used to generate UUIDs.
     *
     * The UuidModule is used to generate UUIDs and to provide the necessary
     * services to the application.
     */
    UuidModule,
  ],
  /**
   * The controllers of the module.
   *
   * This property defines the controllers of the module.
   */
  controllers: [AppController],
  /**
   * The providers of the module.
   *
   * This property defines the providers of the module.
   */
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
  /**
   * The exports of the module.
   *
   * This property defines the exports of the module.
   */
  exports: [AppService],
})
export class AppModule {
  /**
   * Configure the middleware of the application.
   *
   * This method is used to configure the middleware of the application.
   *
   * @param consumer The middleware consumer.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NisConvertJson)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // consumer.apply(fastifyStatic).forRoutes('/pdfGenerateor');
  }
}
