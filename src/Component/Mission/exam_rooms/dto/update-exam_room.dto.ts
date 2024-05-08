import { PartialType } from '@nestjs/swagger';
import { CreateExamRoomDto } from './create-exam_room.dto';

export class UpdateExamRoomDto extends PartialType(CreateExamRoomDto) {}
