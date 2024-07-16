import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Students" )
@Controller( 'student' )
export class StudentController
{
  constructor ( private readonly studentService: StudentService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createStudentDto: CreateStudentDto )
  {
    return this.studentService.create( createStudentDto );
  }

  @ApiBody( { type: [ CreateStudentDto ] } )
  @Post( 'many' )
  createMany ( @Body() createStudentDto: [ CreateStudentDto ] )
  {
    return this.studentService.createMany( createStudentDto );
  }

  @Get()
  findAll ()
  {
    return this.studentService.findAll();
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.studentService.findOne( +id );
  }

  @Get( 'class/:classId' )
  findAllByClassId ( @Param( 'classId' ) classId: string )
  {
    return this.studentService.findAllByClassId( +classId );
  }

  @Get( 'class/:classId/cohort/:cohortId' )
  findAllByClassIdAndCohortId ( @Param( 'classId' ) classId: string, @Param( 'cohortId' ) cohortId: string )
  {
    return this.studentService.findAllByClassIdAndCohortId( +classId, +cohortId );
  }

  @Get( 'cohort/:cohortId' )
  findAllByCohortId ( @Param( 'cohortId' ) cohortId: string )
  {
    return this.studentService.findAllByCohortId( +cohortId );
  }

  @Get( 'school/:schoolId' )
  findAllBySchoolId ( @Param( 'schoolId' ) schoolId: string )
  {
    return this.studentService.findAllBySchoolId( +schoolId );
  }

  @Get( '/controlMission/:controlMissionId' )
  findAllExcludedByControlMissionId ( @Param( 'controlMissionId' ) controlMissionId: String )
  {
    return this.studentService.findAllExcludedByControlMissionId( +controlMissionId );
  }

  @Get( 'school/:schoolId/class/:classId/cohort/:cohortId' )
  findAllBySchoolIdAndClassIdAndCohortId ( @Param( 'schoolId' ) schoolId: string, @Param( 'classId' ) classId: string, @Param( 'cohortId' ) cohortId: string )
  {
    return this.studentService.findAllBySchoolIdAndClassIdAndCohortId( +schoolId, +classId, +cohortId );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateStudentDto: UpdateStudentDto )
  {
    return this.studentService.update( +id, updateStudentDto );
  }
  @Roles( Role.SuperAdmin )

  @Patch( 'many' )
  updateMany ( @Body() updateStudentDto: UpdateStudentDto[] )
  {
    return this.studentService.updateMany( updateStudentDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.studentService.remove( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.studentService.activate( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.studentService.deactivate( +id );
  }
}
