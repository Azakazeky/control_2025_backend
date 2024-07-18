import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { AssignProctorToExamRoomDto, CreateProctorDto } from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';
import { ProctorService } from './proctor.service';
@UseGuards( JwtAuthGuard )
@ApiTags( "proctor" )
@Controller( 'proctor' )
export class ProctorController
{
  constructor ( private readonly proctorService: ProctorService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  async create ( @Body() createProctorDto: CreateProctorDto )
  {
    return this.proctorService.create( createProctorDto );
  }

  @Roles( Role.SuperAdmin )

  @Post( '/assign' )
  async assignProctorToExamRoom ( @Body() assignProctorToExamRoomDto: AssignProctorToExamRoomDto )
  {
    return this.proctorService.assignProctorToExamMission( assignProctorToExamRoomDto );
  }

  @Roles( Role.SuperAdmin )
  @Delete( '/unassign-from-exam-mission/:exam_room_ID/:month/:year/:period' )
  async unAssignProctorFromExamMission ( @Param( 'exam_room_ID' ) exam_room_ID: string, @Param( 'month' ) month: string, @Param( 'year' ) year: string, @Param( 'period' ) period: string )
  {
    return this.proctorService.unAssignProctorFromExamMission( +exam_room_ID, month, year, +period );
  }

  @Roles( Role.SuperAdmin )
  @Delete( '/unassign-from-exam-room/:proctors_ID/:exam_room_ID' )
  async unassignProctorFromExamRoom ( @Param( 'proctors_ID' ) proctors_ID: string, @Param( 'exam_room_ID' ) exam_room_ID: string )
  {
    return this.proctorService.unassignProctorFromExamRoom( +proctors_ID, +exam_room_ID );
  }

  @Get()
  async findAll ()
  {
    return this.proctorService.findAll();
  }

  @Get( ':id' )
  async findOne ( @Param( 'id' ) id: string )
  {
    return this.proctorService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  async update ( @Param( 'id' ) id: string, @Body() updateProctorDto: UpdateProctorDto )
  {
    return this.proctorService.update( +id, updateProctorDto );
  }

  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  async remove ( @Param( 'id' ) id: string )
  {
    return this.proctorService.remove( +id );
  }
}
