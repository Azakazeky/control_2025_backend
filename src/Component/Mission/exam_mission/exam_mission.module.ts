import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { ExamMissionController } from './exam_mission.controller';
import { ExamMissionService } from './exam_mission.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExamMissionController],
  providers: [ExamMissionService],
  exports: [ExamMissionService],
})
export class ExamMissionModule {}
