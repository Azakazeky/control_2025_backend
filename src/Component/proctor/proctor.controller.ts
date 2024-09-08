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
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
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

  // @Roles(Role.SuperAdmin)
  @Post()
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

  // @Roles(Role.SuperAdmin)
  @Post('/assign')
  async assignProctorToExamRoom(
    @Body() assignProctorToExamRoomDto: AssignProctorToExamRoomDto,
    @Req() req: Request,
  ) {
    return this.proctorService.assignProctorToExamMission(
      assignProctorToExamRoomDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Delete('/unassign-from-exam-room/:id')
  async unassignProctorFromExamRoom(@Param('id') proctors_ID: string) {
    return this.proctorService.unassignProctorFromExamRoom(+proctors_ID);
  }

  @Get('/school')
  async findAllBySchoolId(@Req() req: Request) {
    return this.proctorService.findAllBySchoolId(
      req.headers['user']['schoolId'],
    );
  }

  @Get('/exam-room/:exam_room_id')
  async findAllByExamRoomId(
    @Param('exam_room_id') exam_room_id: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.proctorService.findAllByExamRoomId(+exam_room_id, month, year);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.proctorService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
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
  async remove(@Param('id') id: string) {
    return this.proctorService.remove(+id);
  }

  @Roles(Role.Proctor)
  @Get('/control-mission/:id')
  async findExamMiisonsByProctorIdAndControlMissionId(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    return this.proctorService.findExamMiisonsByProctorIdAndControlMissionId(
      req.headers['user']['userId'],
      +id,
    );
  }

  @Roles(Role.Proctor)
  @Get('/control-mission')
  async findAllControlMissions(@Req() req: Request) {
    return this.proctorService.findAllControlMissionsByProctorId(
      req.headers['user']['userId'],
    );
  }
  @Roles(Role.Proctor)
  @Post('validate-principle-password')
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
