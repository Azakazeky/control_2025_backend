import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Post()
  /**
   * Creates a new student.
   * @param createStudentDto The new student data to be created.
   * @param req The request object.
   * @returns The newly created student.
   */
  create(@Body() createStudentDto: CreateStudentDto, @Req() req: Request) {
    return this.studentService.create(
      createStudentDto,
      req.headers['user']['userId'],
      req.headers['user']['schoolId'],
    );
  }

  // ControlSystem
  @ApiBody({ type: [CreateStudentDto] })
  @Post('many')
  /**
   * Creates multiple new students.
   * @param createStudentDto The new students data to be created.
   * @param req The request object.
   * @returns The newly created students.
   */
  createMany(
    @Body() createStudentDto: [CreateStudentDto],
    @Req() req: Request,
  ) {
    return this.studentService.createMany(
      createStudentDto,
      +req.headers['user']['userId'],
      +req.headers['user']['schoolId'],
    );
  }

  //ControlSystem
  @Get('students-grades/control-mission/:controlMissionId')
  /**
   * Retrieves students grouped by grades for a control mission.
   * @param controlMissionId the control mission id
   * @param req the request object
   * @returns An object where each property is a grade and its value is an array of students in that grade.
   */
  getStudentsByGrades(
    @Param('controlMissionId') controlMissionId: string,
    @Req() req: Request,
  ) {
    return this.studentService.getStudentsGrades(
      +controlMissionId,
      +req.headers['user']['schoolId'],
    );
  }

  @Get()
  /**
   * Retrieves all students.
   * @returns An array of all students.
   */
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single student by its id.
   * @param id The id of the student to retrieve.
   * @returns The student with the given id.
   * @throws {NotFoundException} If no student with the given id is found.
   */
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Get('class/:classId')
  /**
   * Retrieves all students in a given class.
   * @param classId The class id.
   * @returns An array of students in the given class.
   */
  findAllByClassId(@Param('classId') classId: string) {
    return this.studentService.findAllByClassId(+classId);
  }

  @Get('class/:classId/cohort/:cohortId')
  /**
   * Retrieves all students in a given class and cohort.
   * @param classId The class id.
   * @param cohortId The cohort id.
   * @returns An array of students in the given class and cohort.
   */
  findAllByClassIdAndCohortId(
    @Param('classId') classId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return this.studentService.findAllByClassIdAndCohortId(+classId, +cohortId);
  }

  @Get('cohort/:cohortId')
  /**
   * Retrieves all students in a given cohort.
   * @param cohortId The cohort id.
   * @returns An array of students in the given cohort.
   */
  findAllByCohortId(@Param('cohortId') cohortId: string) {
    return this.studentService.findAllByCohortId(+cohortId);
  }

  // ControlSystem
  @Get('school/:schoolId')
  /**
   * Retrieves all students in a given school.
   * @param schoolId The school id.
   * @returns An array of students in the given school.
   */
  findAllBySchoolId(@Param('schoolId') schoolId: string) {
    return this.studentService.findAllBySchoolId(+schoolId);
  }

  @Get('/controlMission/:controlMissionId')
  /**
   * Retrieves all students in a given control mission.
   * @param controlMissionId The control mission id.
   * @param req The request object.
   * @returns An array of students in the given control mission.
   */
  findAllByControlMissionId(
    @Param('controlMissionId') controlMissionId: string,
    @Req() req: Request,
  ) {
    return this.studentService.findAllByControlMissionId(
      +controlMissionId,
      +req.headers['user']['schoolId'],
    );
  }

  // ControlSystem
  @Get('excluded/controlMission/:controlMissionId')
  /**
   * Retrieves all students excluded from a given control mission.
   * @param controlMissionId The control mission id.
   * @param req The request object.
   * @returns An array of students excluded from the given control mission.
   */
  findAllExcludedByControlMissionId(
    @Param('controlMissionId') controlMissionId: String,
    @Req() req: Request,
  ) {
    return this.studentService.findAllExcludedByControlMissionId(
      +controlMissionId,
      +req.headers['user']['schoolId'],
    );
  }

  @Get('student-exams')
  /**
   * Retrieves all exams for a given student.
   * @param req The request object.
   * @returns An array of exams for the given student.
   */
  findStudentExams(@Req() req: Request) {
    return this.studentService.findStudentExams(+req.headers['user']['userId']);
  }

  @Get('school/:schoolId/class/:classId/cohort/:cohortId')
  /**
   * Retrieves all students in a given school, class and cohort.
   * @param schoolId The school id.
   * @param classId The class id.
   * @param cohortId The cohort id.
   * @returns An array of students in the given school, class and cohort.
   */
  findAllBySchoolIdAndClassIdAndCohortId(
    @Param('schoolId') schoolId: string,
    @Param('classId') classId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return this.studentService.findAllBySchoolIdAndClassIdAndCohortId(
      +schoolId,
      +classId,
      +cohortId,
    );
  }

  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Patch(':id')
  /**
   * Updates a student.
   * @param id The id of the student to be updated.
   * @param updateStudentDto The student data to be updated.
   * @param req The request object.
   * @returns The updated student.
   */
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const userId = request.headers['user']['userId'];
    return this.studentService.update(+id, updateStudentDto, +userId);
  }
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Patch('many')
  /**
   * Updates multiple students.
   * @param updateStudentDto An array of student data to be updated.
   * @param req The request object.
   * @returns The updated students.
   */
  updateMany(
    @Req() request: Request,
    @Body() updateStudentDto: UpdateStudentDto[],
  ) {
    const userId = request.headers['user']['userId'];
    return this.studentService.updateMany(updateStudentDto, +userId);
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a student by its id.
   * @param id The id of the student to be removed.
   * @returns The removed student.
   * @throws {NotFoundException} If no student with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a student.
   * @param id The id of the student to be activated.
   * @returns The activated student.
   */
  activate(@Param('id') id: string) {
    return this.studentService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a student.
   * @param id The id of the student to be deactivated.
   * @returns The deactivated student.
   */
  deactivate(@Param('id') id: string) {
    return this.studentService.deactivate(+id);
  }

  // @Roles(Role.Student, Role.Proctor, Role.SuperAdmin)
  @Get('student-cheating/:barcode')
  /**
   * Marks a student as cheating.
   * @param barcode The barcode of the student to be marked as cheating.
   * @returns The updated student.
   * @throws {NotFoundException} If no student with the given barcode is found.
   */
  async chetingStudent(@Param('barcode') barcode: string) {
    return await this.studentService.markAsCheating(barcode);
  }

  // @Roles(Role.Proctor, Role.SuperAdmin)
  @Get('uncheating-student/:barcode')
  /**
   * Unmarks a student as cheating.
   * @param barcode The barcode of the student to be unmarked as cheating.
   * @returns The updated student.
   * @throws {NotFoundException} If no student with the given barcode is found.
   * @throws {HttpException} If the user is not a proctor or superadmin.
   */
  async unCheatingStudent(
    @Param('barcode') barcode: string,
    @Req() req: Request,
  ) {
    return await this.studentService.unmarkAsCheating(
      barcode,
      +req.headers['user']['userId'],
    );
  }
}
