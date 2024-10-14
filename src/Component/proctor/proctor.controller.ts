import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import {
  AssignProctorToExamRoomDto,
  CreateProctorDto,
} from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';
import { ProctorService } from './proctor.service';
@UseGuards(JwtAuthGuard)
@ApiTags('proctor')
@Controller('proctor')
export class ProctorController {
  constructor(private readonly proctorService: ProctorService) {}

  // @Roles(Role.SuperAdmin, Role.Principle)
  @Post()
  /**
   * Creates a new proctor.
   * @param createProctorDto the proctor data to be created
   * @param req the request object
   * @returns the newly created proctor
   */
  async create(
    @Body() createProctorDto: CreateProctorDto,
    @Req() req: Request,
  ) {
    return this.proctorService.create(
      createProctorDto,
      req.headers['user']['userId'],
      req.headers['user']['schoolId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.Principle)
  @Post('/assign')
  /**
   * Assigns a proctor to an exam room.
   * @param assignProctorToExamRoomDto the proctor and exam room data to be assigned
   * @param req the request object
   * @returns the newly assigned proctor in room
   */
  async assignProctorToExamRoom(
    @Body() assignProctorToExamRoomDto: AssignProctorToExamRoomDto,
    @Req() req: Request,
  ) {
    return this.proctorService.assignProctorToExamMission(
      assignProctorToExamRoomDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.Principle)
  @Delete('/unassign-from-exam-room/:id')
  /**
   * Unassigns a proctor from an exam room.
   * @param id the proctor id
   * @returns the unassigned proctor in room
   */
  async unassignProctorFromExamRoom(@Param('id') proctors_ID: string) {
    return this.proctorService.unassignProctorFromExamRoom(+proctors_ID);
  }

  @Get('/school')
  /**
   * Retrieves all proctors associated with a school.
   * @param req the request object
   * @returns all proctors associated with the school
   */
  async findAllBySchoolId(@Req() req: Request) {
    return this.proctorService.findAllBySchoolId(
      req.headers['user']['schoolId'],
    );
  }

  @Get('/exam-room/:exam_room_id')
  /**
   * Retrieves all proctors associated with an exam room.
   * @param exam_room_id the exam room id
   * @param month the month to filter by
   * @param year the year to filter by
   * @returns all proctors associated with the exam room
   */
  async findAllByExamRoomId(
    @Param('exam_room_id') exam_room_id: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.proctorService.findAllByExamRoomId(+exam_room_id, month, year);
  }

  @Get(':id')
  /**
   * Retrieves a single proctor by id.
   * @param id the proctor id
   * @returns the proctor with the specified id
   */
  async findOne(@Param('id') id: string) {
    return this.proctorService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a proctor.
   * @param id the proctor id
   * @param updateProctorDto the proctor data to be updated
   * @param req the request object
   * @returns the updated proctor
   */
  async update(
    @Param('id') id: string,
    @Body() updateProctorDto: UpdateProctorDto,
    @Req() req: Request,
  ) {
    return this.proctorService.update(
      +id,
      updateProctorDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a proctor.
   * @param id the proctor id
   * @returns the deleted proctor
   */
  async remove(@Param('id') id: string) {
    return this.proctorService.remove(+id);
  }

  // @Roles(Role.Proctor)
  @Get('/control-mission/:id')
  /**
   * Retrieves all exam missions associated with a proctor and a control mission.
   * @param id the control mission id
   * @param req the request object
   * @returns all exam missions associated with the proctor and control mission
   */
  async findExamMiisonsByProctorIdAndControlMissionId(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    return this.proctorService.findExamMiisonsByProctorIdAndControlMissionId(
      req.headers['user']['userId'],
      +id,
    );
  }

  // @Roles(Role.SuperAdmin, Role.Proctor)
  @Get('/control-mission')
  /**
   * Retrieves all control missions associated with a proctor.
   * @param req the request object
   * @returns all control missions associated with the proctor
   */
  async findAllControlMissions(@Req() req: Request) {
    return this.proctorService.findAllControlMissionsByProctorId(
      req.headers['user']['userId'],
    );
  }
  // @Roles(Role.SuperAdmin, Role.Proctor)
  @Post('validate-principle-password')
  /**
   * Validates a proctor's principle password.
   * @param req the request object
   * @param body the request body object with the password
   * @returns true if the password is valid, otherwise throws an error
   */
  async validatePrinciplePassword(
    @Req() req: Request,
    @Body() body: { password: string },
  ) {
    return this.proctorService.validatePrinciplePassword(
      req.headers['user']['userId'],
      body.password,
    );
  }
}
