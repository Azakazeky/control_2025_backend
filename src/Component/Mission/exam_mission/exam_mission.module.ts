import { Module } from '@nestjs/common';
import { ExamMissionService } from './exam_mission.service';
import { ExamMissionController } from './exam_mission.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [ExamMissionController],
  providers: [ExamMissionService,PrismaService],
})
export class ExamMissionModule {}
