import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { ControlMissionController } from './control_mission.controller';
import { ControlMissionService } from './control_mission.service';

@Module({
  imports: [PrismaModule],
  controllers: [ControlMissionController],
  providers: [ControlMissionService],
})
export class ControlMissionModule {}
