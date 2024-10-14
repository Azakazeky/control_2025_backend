import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';
import { StudentSeatNumbersService } from './student_seat_numbers.service';

@UseGuards(JwtAuthGuard)
@ApiTags('student-seat-numbers')
@Controller('student-seat-numbers')
export class StudentSeatNumbersController {
  /**
   * The constructor for the StudentSeatNumbersController class.
   * @param studentSeatNumbersService the injected StudentSeatNumbersService instance.
   */
  constructor(
    private readonly studentSeatNumbersService: StudentSeatNumbersService,
  ) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new student seat number.
   * @param createStudentSeatNumberDto the student seat number data to be created.
   * @returns the newly created student seat number.
   */
  create(@Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto) {
    return this.studentSeatNumbersService.create(createStudentSeatNumberDto);
  }

  @Get()
  /**
   * Retrieves all student seat numbers.
   * @returns all student seat numbers.
   */
  findAll() {
    return this.studentSeatNumbersService.findAll();
  }

  // ControlSystem
  @Get('control-mission/:controlMissionId')
  /**
   * Retrieves all student seat numbers associated with a control mission.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers associated with the control mission.
   */
  findAllByControlMissionId(
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.studentSeatNumbersService.findAllByControlMissionId(
      +controlMissionId,
    );
  }
  @Get('control-mission/:controlMissionId/exam-room/:examRoomId')
  /**
   * Retrieves all student seat numbers associated with a control mission and exam room.
   * @param controlMissionId the control mission id.
   * @param examRoomId the exam room id.
   * @returns all student seat numbers associated with the control mission and exam room.
   */
  findAllByControlMissionIdAndExamRoomId(
    @Param('controlMissionId') controlMissionId: string,
    @Param('examRoomId') examRoomId: string,
  ) {
    return this.studentSeatNumbersService.findAllByControlMissionIdAndExamRoomId(
      +controlMissionId,
      +examRoomId,
    );
  }

  @Get('student/:studentId')
  /**
   * Retrieves all student seat numbers associated with a student.
   * @param studentId the student id.
   * @returns all student seat numbers associated with the student.
   */
  findAllByStudentId(@Param('studentId') studentId: string) {
    return this.studentSeatNumbersService.findAllByStudentId(+studentId);
  }

  @Get('exam-room/:examRoomId')
  /**
   * Retrieves all student seat numbers associated with an exam room.
   * @param examRoomId the exam room id.
   * @returns all student seat numbers associated with the exam room.
   */
  findAllByExamRoomId(@Param('examRoomId') examRoomId: string) {
    return this.studentSeatNumbersService.findAllByExamRoomId(+examRoomId);
  }

  @Get('student/:studentId/exam-room/:examRoomId')
  /**
   * Retrieves all student seat numbers associated with a student and exam room.
   * @param studentId the student id.
   * @param examRoomId the exam room id.
   * @returns all student seat numbers associated with the student and exam room.
   */
  findAllByStudentIdAndExamRoomId(
    @Param('studentId') studentId: string,
    @Param('examRoomId') examRoomId: string,
  ) {
    return this.studentSeatNumbersService.findAllByStudentIdAndExamRoomId(
      +studentId,
      +examRoomId,
    );
  }

  @Get('student/:studentId/control-mission/:controlMissionId')
  /**
   * Retrieves all student seat numbers associated with a student and control mission.
   * @param studentId the student id.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers associated with the student and control mission.
   */
  findAllByStudentIdAndControlMissionId(
    @Param('studentId') studentId: string,
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.studentSeatNumbersService.findAllByStudentIdAndControlMissionId(
      +studentId,
      +controlMissionId,
    );
  }

  @Get(
    'student/:studentId/exam-room/:examRoomId/control-mission/:controlMissionId',
  )
  /**
   * Retrieves all student seat numbers associated with a student, exam room and control mission.
   * @param studentId the student id.
   * @param examRoomId the exam room id.
   * @param controlMissionId the control mission id.
   * @returns all student seat numbers associated with the student, exam room and control mission.
   */
  findAllByStudentIdAndExamRoomIdAndControlMissionId(
    @Param('studentId') studentId: string,
    @Param('examRoomId') examRoomId: string,
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.studentSeatNumbersService.findAllByStudentIdAndExamRoomIdAndControlMissionId(
      +studentId,
      +examRoomId,
      +controlMissionId,
    );
  }

  // ControlSystem
  @Get(':id')
  /**
   * Retrieves a single student seat number by its id.
   * @param id the id of the student seat number to retrieve.
   * @returns the student seat number with the specified id.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  findOne(@Param('id') id: string) {
    return this.studentSeatNumbersService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a student seat number by its id.
   * @param id the id of the student seat number to update.
   * @param updateStudentSeatNumberDto the student seat number data to be updated.
   * @returns the updated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  update(
    @Param('id') id: string,
    @Body() updateStudentSeatNumberDto: UpdateStudentSeatNumberDto,
  ) {
    return this.studentSeatNumbersService.update(
      +id,
      updateStudentSeatNumberDto,
    );
  }
  // @Roles(Role.SuperAdmin)

  // ControlSystem
  @Patch('many')
  /**
   * Updates multiple student seat numbers.
   * @param updateStudentSeatNumberDto an array of student seat number data to be updated.
   * @returns the updated student seat numbers.
   */
  updateMany(@Body() updateStudentSeatNumberDto: UpdateStudentSeatNumberDto[]) {
    return this.studentSeatNumbersService.updateMany(
      updateStudentSeatNumberDto,
    );
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Deletes a student seat number by its id.
   * @param id the id of the student seat number to delete.
   * @returns the deleted student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.studentSeatNumbersService.remove(+id);
  }

  // ControlSystem
  @Patch('activate/:id')
  /**
   * Activates a student seat number by its id.
   * @param id the id of the student seat number to activate.
   * @returns the activated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  activate(@Param('id') id: string) {
    return this.studentSeatNumbersService.activate(+id);
  }

  // ControlSystem
  @Patch('deactivate/:id')
  /**
   * Deactivates a student seat number by its id.
   * @param id the id of the student seat number to deactivate.
   * @returns the deactivated student seat number.
   * @throws {NotFoundException} If no student seat number with the given id is found.
   */
  deactivate(@Param('id') id: string) {
    return this.studentSeatNumbersService.deactivate(+id);
  }
}
