import { PartialType } from '@nestjs/swagger';
import { CreateControlMissionDto } from './create-control_mission.dto';

export class UpdateControlMissionDto extends PartialType(CreateControlMissionDto) {}
