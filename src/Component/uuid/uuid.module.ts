import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { ExamMissionModule } from '../Mission/exam_mission/exam_mission.module';
import { UuidController } from './uuid.controller';
import { UuidService } from './uuid.service';

@Module({
  imports: [PrismaModule, ExamMissionModule],
  controllers: [UuidController],
  providers: [UuidService, AppService],
})
export class UuidModule {}
