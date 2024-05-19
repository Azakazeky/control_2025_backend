import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {  NisConvertJson } from './Common/MiddleWare/ConvertJson.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Component/auth/auth.module';
import { ClassDeskModule } from './Component/School_Setting/class_desk/class_desk.module';
import { GradesModule } from './Component/School_Setting/grades/grades.module';
import { SchoolClassesModule } from './Component/School_Setting/school_classes/school_classes.module';
import { SchoolsModule } from './Component/School_Setting/schools/schools.module';
import { CohortModule } from './Component/School_Setting/cohort/cohort.module';
import { SubjectsModule } from './Component/School_Setting/subjects/subjects.module';
import { StudentModule } from './Component/student/student.module';
import { ControlMissionModule } from './Component/Mission/control_mission/control_mission.module';
import { ExamMissionModule } from './Component/Mission/exam_mission/exam_mission.module';
import { ExamRoomsModule } from './Component/Mission/exam_rooms/exam_rooms.module';
import { StudentBarcodesModule } from './Component/Mission/student_barcodes/student_barcodes.module';
import { StudentSeatNumbersModule } from './Component/Mission/student_seat_numbers/student_seat_numbers.module';
import { EducationYearModule } from './Component/School_Setting/education_year/education_year.module';
import { UserRolesSystemsModule } from './Users_System/user_roles_systems/user_roles_systems.module';
import { UsersModule } from './Users_System/users/users.module';
import { SchoolTypeModule } from './Component/School_Setting/school_type/school_type.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './Common/Guard/roles.guard';
import { LoggingInterceptor } from './Common/logging.interceptor';

@Module({
  imports: [
    // MulterModule.register({ dest: './uploads' }),
    // ConfigModule.forRoot(),
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
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // { provide: APP_GUARD, useClass: AuthGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NisConvertJson)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}