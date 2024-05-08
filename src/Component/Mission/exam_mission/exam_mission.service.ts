import { Injectable } from '@nestjs/common';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';

@Injectable()
export class ExamMissionService {
  create(createExamMissionDto: CreateExamMissionDto) {
    return 'This action adds a new examMission';
  }

  findAll() {
    return `This action returns all examMission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examMission`;
  }

  update(id: number, updateExamMissionDto: UpdateExamMissionDto) {
    return `This action updates a #${id} examMission`;
  }

  remove(id: number) {
    return `This action removes a #${id} examMission`;
  }
}
