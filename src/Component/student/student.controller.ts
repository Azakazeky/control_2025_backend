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
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ControlSystem
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Post()
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
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Get('class/:classId')
  findAllByClassId(@Param('classId') classId: string) {
    return this.studentService.findAllByClassId(+classId);
  }

  @Get('class/:classId/cohort/:cohortId')
  findAllByClassIdAndCohortId(
    @Param('classId') classId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return this.studentService.findAllByClassIdAndCohortId(+classId, +cohortId);
  }

  @Get('cohort/:cohortId')
  findAllByCohortId(@Param('cohortId') cohortId: string) {
    return this.studentService.findAllByCohortId(+cohortId);
  }

  // ControlSystem
  @Get('school/:schoolId')
  findAllBySchoolId(@Param('schoolId') schoolId: string) {
    return this.studentService.findAllBySchoolId(+schoolId);
  }

  @Get('/controlMission/:controlMissionId')
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
  findStudentExams(@Req() req: Request) {
    return this.studentService.findStudentExams(+req.headers['user']['userId']);
  }

  @Get('school/:schoolId/class/:classId/cohort/:cohortId')
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

  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Patch('many')
  updateMany(@Body() updateStudentDto: UpdateStudentDto[]) {
    return this.studentService.updateMany(updateStudentDto);
  }
  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.studentService.activate(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.studentService.deactivate(+id);
  }

  @Roles(Role.Student, Role.Proctor, Role.SuperAdmin)
  @Get('student-cheating/:barcode')
  async chetingStudent(@Param('barcode') barcode: string) {
    return await this.studentService.markAsCheating(barcode);
  }

  @Roles(Role.Proctor, Role.SuperAdmin)
  @Get('uncheating-student/:barcode')
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
