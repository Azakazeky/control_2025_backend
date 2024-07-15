import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';
import { StudentSeatNumbersService } from './student_seat_numbers.service';

@UseGuards( JwtAuthGuard )
@ApiTags( 'student-seat-numbers' )
@UseFilters( PrismaExceptionFilter )
@Controller( 'student-seat-numbers' )
export class StudentSeatNumbersController
{
  constructor ( private readonly studentSeatNumbersService: StudentSeatNumbersService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto )
  {
    return this.studentSeatNumbersService.create( createStudentSeatNumberDto );
  }

  @Get()
  findAll ()
  {
    return this.studentSeatNumbersService.findAll();
  }

  @Get( 'control-mission/:controlMissionId' )
  findAllByControlMissionId ( @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.studentSeatNumbersService.findAllByControlMissionId( +controlMissionId );
  }
  @Get( 'control-mission/:controlMissionId/exam-room/:examRoomId' )
  findAllByControlMissionIdAndExamRoomId ( @Param( 'controlMissionId' ) controlMissionId: string, @Param( 'examRoomId' ) examRoomId: string )
  {
    return this.studentSeatNumbersService.findAllByControlMissionIdAndExamRoomId( +controlMissionId, +examRoomId );
  }

  @Get( 'student/:studentId' )
  findAllByStudentId ( @Param( 'studentId' ) studentId: string )
  {
    return this.studentSeatNumbersService.findAllByStudentId( +studentId );
  }

  @Get( 'exam-room/:examRoomId' )
  findAllByExamRoomId ( @Param( 'examRoomId' ) examRoomId: string )
  {
    return this.studentSeatNumbersService.findAllByExamRoomId( +examRoomId );
  }

  @Get( 'student/:studentId/exam-room/:examRoomId' )
  findAllByStudentIdAndExamRoomId ( @Param( 'studentId' ) studentId: string, @Param( 'examRoomId' ) examRoomId: string )
  {
    return this.studentSeatNumbersService.findAllByStudentIdAndExamRoomId( +studentId, +examRoomId );
  }

  @Get( 'student/:studentId/control-mission/:controlMissionId' )
  findAllByStudentIdAndControlMissionId ( @Param( 'studentId' ) studentId: string, @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.studentSeatNumbersService.findAllByStudentIdAndControlMissionId( +studentId, +controlMissionId );
  }

  @Get( 'student/:studentId/exam-room/:examRoomId/control-mission/:controlMissionId' )
  findAllByStudentIdAndExamRoomIdAndControlMissionId ( @Param( 'studentId' ) studentId: string, @Param( 'examRoomId' ) examRoomId: string, @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.studentSeatNumbersService.findAllByStudentIdAndExamRoomIdAndControlMissionId( +studentId, +examRoomId, +controlMissionId );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.studentSeatNumbersService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateStudentSeatNumberDto: UpdateStudentSeatNumberDto )
  {
    return this.studentSeatNumbersService.update( +id, updateStudentSeatNumberDto );
  }
  @Roles( Role.SuperAdmin )

  @Patch( 'many' )
  updateMany ( @Body() updateStudentSeatNumberDto: UpdateStudentSeatNumberDto[] )
  {
    return this.studentSeatNumbersService.updateMany( updateStudentSeatNumberDto );
  }

  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.studentSeatNumbersService.remove( +id );
  }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'activate/:id' )
  // activate ( @Param( 'id' ) id: string )
  // {
  //   return this.studentSeatNumbersService.activate( +id );
  // }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'deactivate/:id' )
  // deactivate ( @Param( 'id' ) id: string )
  // {
  //   return this.studentSeatNumbersService.deactivate( +id );
  // }
}
