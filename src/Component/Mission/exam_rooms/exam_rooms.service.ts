import { Injectable } from '@nestjs/common';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';

@Injectable()
export class ExamRoomsService {
  create(createExamRoomDto: CreateExamRoomDto) {
    return 'This action adds a new examRoom';
  }

  findAll() {
    return `This action returns all examRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examRoom`;
  }

  update(id: number, updateExamRoomDto: UpdateExamRoomDto) {
    return `This action updates a #${id} examRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} examRoom`;
  }
}
