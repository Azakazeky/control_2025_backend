import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ExamMissionController } from './exam_mission.controller';
import { ExamMissionService } from './exam_mission.service';

@Module({
  controllers: [ExamMissionController],
  providers: [ExamMissionService, PrismaService],
  exports: [ExamMissionService],
})
export class ExamMissionModule {}
