import { Module } from '@nestjs/common';
import { ControlMissionService } from './control_mission.service';
import { ControlMissionController } from './control_mission.controller';

@Module({
  controllers: [ControlMissionController],
  providers: [ControlMissionService],
})
export class ControlMissionModule {}
