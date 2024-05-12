import { Module } from '@nestjs/common';
import { ControlMissionService } from './control_mission.service';
import { ControlMissionController } from './control_mission.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [ControlMissionController],
  providers: [ControlMissionService,PrismaService],
})
export class ControlMissionModule {}
