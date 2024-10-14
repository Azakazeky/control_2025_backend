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
import { ControlMissionService } from './control_mission.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { CreateStudentSeatNumberDto } from './dto/create-student-seat-numbers.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Control-Mission')
@Controller('control-mission')
export class ControlMissionController {
  constructor(private readonly controlMissionService: ControlMissionService) {}

  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Post()
  /**
   * Creates a new control mission.
   * @param createControlMissionDto the control mission data to be created
   * @param req the request object
   * @returns the newly created control mission
   */
  create(
    @Body() createControlMissionDto: CreateControlMissionDto,
    @Req() req: Request,
  ) {
    return this.controlMissionService.create(
      createControlMissionDto,
      req.headers['user']['userId'],
      req.headers['user']['schoolId'],
    );
  }

  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @ApiBody({ type: CreateStudentSeatNumberDto })
  @Post('student-seat-numbers')
  /**
   * Creates new student seat numbers.
   * @param createStudentSeatNumberDto the student seat numbers data to be created
   * @returns the newly created student seat numbers
   */
  createStudentSeatNumbers(
    @Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto,
  ) {
    return this.controlMissionService.createStudentSeatNumbers(
      createStudentSeatNumberDto,
    );
  }
  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @ApiBody({ type: CreateStudentSeatNumberDto })
  @Patch('student-seat-numbers')
  /**
   * Adds new students to the control mission.
   * @param createStudentSeatNumberDto the student seat numbers data to be added
   * @returns the newly added student seat numbers
   */
  addNewStudentsToMission(
    @Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto,
  ) {
    return this.controlMissionService.addNewStudentsToMission(
      createStudentSeatNumberDto,
    );
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Get()
  /**
   * Retrieves all control missions.
   * @returns all control missions
   */
  findAll() {
    return this.controlMissionService.findAll();
  }

  // ControlSystem
  @Get('distribution/:controlMissionId')
  /**
   * Retrieves the distribution of students in a control mission.
   * @param controlMissionId the control mission id
   * @returns the distribution of students in the control mission
   */
  findAllDistributionByControlMissionId(
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.controlMissionService.findAllDistributionByControlMissionId(
      +controlMissionId,
    );
  }

  // ControlSystem
  @Get('active/school/:schoolId/education-year/:educationYearId')
  /**
   * Retrieves all active control missions associated with an education year and school.
   * @param educationYearId the education year id
   * @param req the request object
   * @returns all active control missions associated with the education year and school
   */
  findAllActiveByEducationYearIdAndSchoolId(
    @Param('educationYearId') educationYearId: string,
    @Req() req: Request,
  ) {
    return this.controlMissionService.findAllActiveByEducationYearIdAndSchoolId(
      +req.headers['user']['schoolId'],
      +educationYearId,
    );
  }
  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Get('school/:schoolId/education-year/:educationYearId')
  /**
   * Retrieves all control missions associated with an education year and school.
   * @param educationYearId the education year id
   * @param req the request object
   * @returns all control missions associated with the education year and school
   */
  findAllByEducationYearIdAndSchoolId(
    @Param('educationYearId') educationYearId: string,
    @Req() req: Request,
  ) {
    return this.controlMissionService.findAllByEducationYearIdAndSchoolId(
      +req.headers['user']['schoolId'],
      +educationYearId,
    );
  }

  @Get('schoolId/')
  /**
   * Retrieves all control missions associated with the user's school.
   * @param req the request object
   * @returns all control missions associated with the user's school
   */
  findAllBySchoolId(@Req() req: Request) {
    return this.controlMissionService.findAllBySchoolId(
      +req.headers['user']['schoolId'],
    );
  }

  @Get('grades/:cmid')
  /**
   * Retrieves all grades associated with a control mission.
   * @param cmid the control mission id
   * @returns all grades associated with the control mission
   */
  findGradesAllByid(@Param('cmid') cmid: string) {
    return this.controlMissionService.findGradesByCMID(+cmid);
  }

  @Get('education-year/:educationYearId')
  /**
   * Retrieves all control missions associated with an education year.
   * @param educationYearId the education year id
   * @returns all control missions associated with the education year
   */
  findAllByEducationYearId(@Param('educationYearId') educationYearId: string) {
    return this.controlMissionService.findAllByEducationYearId(
      +educationYearId,
    );
  }

  @Get(':id')
  /**
   * Retrieves a control mission by its id.
   * @param id the control mission id
   * @returns the control mission
   */
  findOne(@Param('id') id: string) {
    return this.controlMissionService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Patch(':id')
  /**
   * Updates a control mission.
   * @param id the control mission id
   * @param updateControlMissionDto the control mission data to be updated
   * @param req the request object
   * @returns the updated control mission
   */
  update(
    @Param('id') id: string,
    @Body() updateControlMissionDto: UpdateControlMissionDto,
    @Req() req: Request,
  ) {
    return this.controlMissionService.update(
      +id,
      updateControlMissionDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a control mission by its id.
   * @param id the control mission id
   */
  remove(@Param('id') id: string) {
    return this.controlMissionService.remove(+id);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch('activate/:id')
  /**
   * Activates a control mission.
   * @param id the control mission id
   * @param req the request object
   * @returns the activated control mission
   */
  activate(@Param('id') id: string, @Req() req: Request) {
    return this.controlMissionService.activate(
      +id,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO, Role.ControlOfficer)
  @Patch('deactivate/:id')
  /**
   * Deactivates a control mission.
   * @param id the control mission id
   * @param req the request object
   * @returns the deactivated control mission
   */
  deactivate(@Param('id') id: string, @Req() req: Request) {
    return this.controlMissionService.deactivate(
      +id,
      req.headers['user']['userId'],
    );
  }
}
