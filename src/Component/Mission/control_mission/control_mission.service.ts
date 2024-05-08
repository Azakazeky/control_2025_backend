import { Injectable } from '@nestjs/common';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@Injectable()
export class ControlMissionService {
  create(createControlMissionDto: CreateControlMissionDto) {
    return 'This action adds a new controlMission';
  }

  findAll() {
    return `This action returns all controlMission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} controlMission`;
  }

  update(id: number, updateControlMissionDto: UpdateControlMissionDto) {
    return `This action updates a #${id} controlMission`;
  }

  remove(id: number) {
    return `This action removes a #${id} controlMission`;
  }
}
