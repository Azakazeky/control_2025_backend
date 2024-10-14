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
  /**
   * Creates a new exam room.
   * @param createExamRoomDto the exam room data to be created
   * @param req the request object
   * @returns the newly created exam room
   */
  create(@Body() createExamRoomDto: CreateExamRoomDto, @Req() req: Request) {
    return this.examRoomsService.create(
      createExamRoomDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  /**
   * Retrieves all exam rooms.
   * @returns all exam rooms
   */
  findAll() {
    return this.examRoomsService.findAll();
  }

  // ControlSystem
  @Get('control-mission/:controlMissionId')
  /**
   * Retrieves all exam rooms associated with a control mission.
   * @param controlMissionId the control mission id
   * @param req the request object
   * @returns all exam rooms associated with the control mission
   */
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
  /**
   * Retrieves all exam rooms associated with a control mission and visible to a proctor.
   * @param controlMissionId the control mission id
   * @returns all exam rooms associated with the control mission and visible to a proctor
   */
  findAllByControlMissionIdForProctor(
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.examRoomsService.findAllByControlMissionIdForProctor(
      +controlMissionId,
    );
  }

  @Get('proctor/:proctorId')
  /**
   * Retrieves all exam rooms associated with a proctor.
   * @param proctorId the proctor id
   * @returns all exam rooms associated with the proctor
   */
  findAllByProctorId(@Param('proctorId') proctorId: string) {
    return this.examRoomsService.findAllByProctorId(+proctorId);
  }

  @Get('next-exams')
  /**
   * Retrieves all upcoming exams for a proctor.
   * @param req the request object
   * @returns all upcoming exams for the proctor
   */
  findNextExams(@Req() req: Request) {
    return this.examRoomsService.findNextExams(req.headers['user']['userId']);
  }

  @Get('school-class/:schoolClassId')
  /**
   * Retrieves all exam rooms associated with a school class.
   * @param schoolClassId the school class id
   * @returns all exam rooms associated with the school class
   */
  findAllBySchoolClassId(@Param('schoolClassId') schoolClassId: string) {
    return this.examRoomsService.findAllBySchoolClassId(+schoolClassId);
  }

  @Get('school-class/:schoolClassId/control-mission/:controlMissionId')
  /**
   * Retrieves all exam rooms associated with a school class and control mission.
   * @param schoolClassId the school class id
   * @param controlMissionId the control mission id
   * @returns all exam rooms associated with the school class and control mission
   */
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
  /**
   * Retrieves a single exam room by id.
   * @param id the exam room id
   * @returns the exam room with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.examRoomsService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates an exam room.
   * @param id the exam room id
   * @param updateExamRoomDto the exam room data to be updated
   * @param req the request object
   * @returns the updated exam room
   */
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
  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Delete(':id')
  /**
   * Deletes an exam room by its id.
   * @param id the exam room id
   */
  remove(@Param('id') id: string) {
    return this.examRoomsService.remove(+id);
  }
}
