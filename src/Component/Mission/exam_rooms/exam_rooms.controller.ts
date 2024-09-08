import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';
import { ExamRoomsService } from './exam_rooms.service';

// @UseGuards( JwtAuthGuard )
@ApiTags('Exam-Room')
@Controller('exam-rooms')
export class ExamRoomsController {
  constructor(private readonly examRoomsService: ExamRoomsService) {}

  // ControlSystem
  // @Roles(Role.SuperAdmin)
  @Post()
  create(@Body() createExamRoomDto: CreateExamRoomDto, @Req() req: Request) {
    return this.examRoomsService.create(
      createExamRoomDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  findAll() {
    return this.examRoomsService.findAll();
  }

  // ControlSystem
  @Get('control-mission/:controlMissionId')
  findAllByControlMissionId(
    @Param('controlMissionId') controlMissionId: string,
    @Req() req: Request,
  ) {
    return this.examRoomsService.findAllByControlMissionId(
      +controlMissionId,
      req.headers['user']['schoolId'],
    );
  }

  @Get('proctor/control-mission/:controlMissionId')
  findAllByControlMissionIdForProctor(
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.examRoomsService.findAllByControlMissionIdForProctor(
      +controlMissionId,
    );
  }

  @Get('proctor/:proctorId')
  findAllByProctorId(@Param('proctorId') proctorId: string) {
    return this.examRoomsService.findAllByProctorId(+proctorId);
  }

  @Get('next-exams')
  findNextExams(@Req() req: Request) {
    return this.examRoomsService.findNextExams(req.headers['user']['userId']);
  }

  @Get('school-class/:schoolClassId')
  findAllBySchoolClassId(@Param('schoolClassId') schoolClassId: string) {
    return this.examRoomsService.findAllBySchoolClassId(+schoolClassId);
  }

  @Get('school-class/:schoolClassId/control-mission/:controlMissionId')
  findAllBySchoolClassIdAndControlMissionId(
    @Param('schoolClassId') schoolClassId: string,
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.examRoomsService.findAllBySchoolClassIdAndControlMissionId(
      +schoolClassId,
      +controlMissionId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examRoomsService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamRoomDto: UpdateExamRoomDto,
    @Req() req: Request,
  ) {
    return this.examRoomsService.update(
      +id,
      updateExamRoomDto,
      req.headers['user']['userId'],
    );
  }

  // ControlSystem
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examRoomsService.remove(+id);
  }
}
