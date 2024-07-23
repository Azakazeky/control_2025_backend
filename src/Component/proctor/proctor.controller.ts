import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Roles(Role.SuperAdmin)
  @Post()
  async create(@Body() createProctorDto: CreateProctorDto) {
    return this.proctorService.create(createProctorDto);
  }

  @Roles(Role.SuperAdmin)
  @Post('/assign')
  async assignProctorToExamRoom(
    @Body() assignProctorToExamRoomDto: AssignProctorToExamRoomDto,
  ) {
    return this.proctorService.assignProctorToExamMission(
      assignProctorToExamRoomDto,
    );
  }

  @Roles(Role.SuperAdmin)
  @Delete('/unassign-from-exam-room/:id')
  async unassignProctorFromExamRoom(@Param('id') proctors_ID: string) {
    return this.proctorService.unassignProctorFromExamRoom(+proctors_ID);
  }

  @Get('/school/:school_id')
  async findAllBySchoolId(@Param('school_id') school_id: string) {
    return this.proctorService.findAllBySchoolId(+school_id);
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

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProctorDto: UpdateProctorDto,
  ) {
    return this.proctorService.update(+id, updateProctorDto);
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.proctorService.remove(+id);
  }
}
