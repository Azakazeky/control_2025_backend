import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './Common/Guard/auth.guard';
import { RolesGuard } from './Common/Guard/roles.guard';
import { NisConvertJson } from './Common/MiddleWare/ConvertJson.middleware';
import { LoggingInterceptor } from './Common/logging.interceptor';
import { ControlMissionModule } from './Component/Mission/control_mission/control_mission.module';
import { ExamMissionModule } from './Component/Mission/exam_mission/exam_mission.module';
import { ExamRoomsModule } from './Component/Mission/exam_rooms/exam_rooms.module';
import { StudentBarcodesModule } from './Component/Mission/student_barcodes/student_barcodes.module';
import { StudentSeatNumbersModule } from './Component/Mission/student_seat_numbers/student_seat_numbers.module';
import { ClassDeskModule } from './Component/School_Setting/class_desk/class_desk.module';
import { CohortModule } from './Component/School_Setting/cohort/cohort.module';
import { EducationYearModule } from './Component/School_Setting/education_year/education_year.module';
import { GradesModule } from './Component/School_Setting/grades/grades.module';
import { SchoolClassesModule } from './Component/School_Setting/school_classes/school_classes.module';
import { SchoolTypeModule } from './Component/School_Setting/school_type/school_type.module';
import { SchoolsModule } from './Component/School_Setting/schools/schools.module';
import { SubjectsModule } from './Component/School_Setting/subjects/subjects.module';
import { AuthModule } from './Component/auth/auth.module';
import { AuthService } from './Component/auth/auth.service';
import { StudentModule } from './Component/student/student.module';
import { UserRolesSystemsModule } from './Users_System/user_roles_systems/user_roles_systems.module';
import { UsersModule } from './Users_System/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StageModule } from './component/school_setting/stage/stage.module';
import { ProctorModule } from './component/proctor/proctor.module';

@Module( {
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
    StageModule,
    ProctorModule,
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    AuthService,
    JwtService,

    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
} )
export class AppModule
{

  configure ( consumer: MiddlewareConsumer )
  {
    consumer
      .apply( NisConvertJson )
      .forRoutes( { path: '*', method: RequestMethod.ALL } );
  }
}