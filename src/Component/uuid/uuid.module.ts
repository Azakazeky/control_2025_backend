import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ExamMissionService } from '../Mission/exam_mission/exam_mission.service';
import { UuidController } from './uuid.controller';
import { UuidService } from './uuid.service';

@Module({
  controllers: [UuidController],
  providers: [UuidService, PrismaService, ExamMissionService],
})
export class UuidModule {}
