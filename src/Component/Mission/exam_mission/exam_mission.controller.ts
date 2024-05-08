import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamMissionService } from './exam_mission.service';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';

@Controller('exam-mission')
export class ExamMissionController {
  constructor(private readonly examMissionService: ExamMissionService) {}

  @Post()
  create(@Body() createExamMissionDto: CreateExamMissionDto) {
    return this.examMissionService.create(createExamMissionDto);
  }

  @Get()
  findAll() {
    return this.examMissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examMissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamMissionDto: UpdateExamMissionDto) {
    return this.examMissionService.update(+id, updateExamMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examMissionService.remove(+id);
  }
}
