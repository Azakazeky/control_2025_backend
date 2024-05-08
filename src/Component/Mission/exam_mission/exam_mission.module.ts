import { Module } from '@nestjs/common';
import { ExamMissionService } from './exam_mission.service';
import { ExamMissionController } from './exam_mission.controller';

@Module({
  controllers: [ExamMissionController],
  providers: [ExamMissionService],
})
export class ExamMissionModule {}
