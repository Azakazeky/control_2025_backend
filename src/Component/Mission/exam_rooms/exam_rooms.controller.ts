import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamRoomsService } from './exam_rooms.service';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';

@Controller('exam-rooms')
export class ExamRoomsController {
  constructor(private readonly examRoomsService: ExamRoomsService) {}

  @Post()
  create(@Body() createExamRoomDto: CreateExamRoomDto) {
    return this.examRoomsService.create(createExamRoomDto);
  }

  @Get()
  findAll() {
    return this.examRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamRoomDto: UpdateExamRoomDto) {
    return this.examRoomsService.update(+id, updateExamRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examRoomsService.remove(+id);
  }
}
