import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateExamRoomDto } from './dto/create-exam_room.dto';
import { UpdateExamRoomDto } from './dto/update-exam_room.dto';
import { ExamRoomsService } from './exam_rooms.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Exam-Room" )
@Controller( 'exam-rooms' )
export class ExamRoomsController
{
  constructor ( private readonly examRoomsService: ExamRoomsService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create ( @Body() createExamRoomDto: CreateExamRoomDto )
  {
    return this.examRoomsService.create( createExamRoomDto );
  }

  @Get()
  findAll ()
  {
    return this.examRoomsService.findAll();
  }

  @Get( 'control-mission/:controlMissionId' )
  findAllByControlMissionId ( @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.examRoomsService.findAllByControlMissionId( +controlMissionId );
  }

  @Get( 'school-class/:schoolClassId' )
  findAllBySchoolClassId ( @Param( 'schoolClassId' ) schoolClassId: string )
  {
    return this.examRoomsService.findAllBySchoolClassId( +schoolClassId );
  }

  @Get( 'school-class/:schoolClassId/control-mission/:controlMissionId' )
  findAllBySchoolClassIdAndControlMissionId ( @Param( 'schoolClassId' ) schoolClassId: string, @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.examRoomsService.findAllBySchoolClassIdAndControlMissionId( +schoolClassId, +controlMissionId );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.examRoomsService.findOne( +id );
  }
  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateExamRoomDto: UpdateExamRoomDto )
  {
    return this.examRoomsService.update( +id, updateExamRoomDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.examRoomsService.remove( +id );
  }
}
