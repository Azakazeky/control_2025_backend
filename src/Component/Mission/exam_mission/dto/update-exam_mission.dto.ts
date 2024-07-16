import { PartialType } from '@nestjs/swagger';
import { CreateExamMissionDto } from './create-exam_mission.dto';

export class UpdateExamMissionDto extends PartialType( CreateExamMissionDto ) { }
