import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { ControlMissionService } from './control_mission.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { CreateStudentSeatNumberDto } from './dto/create-student-seat-numbers.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@UseGuards( JwtAuthGuard )
@ApiTags( "Control-Mission" )
@UseFilters( PrismaExceptionFilter )
@Controller( 'control-mission' )
export class ControlMissionController
{
  constructor ( private readonly controlMissionService: ControlMissionService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createControlMissionDto: CreateControlMissionDto )
  {
    return this.controlMissionService.create( createControlMissionDto );
  }

  @Roles( Role.SuperAdmin )
  @ApiBody( { type: CreateStudentSeatNumberDto } )
  @Post( 'student-seat-numbers' )
  createStudentSeatNumbers ( @Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto )
  {
    return this.controlMissionService.createStudentSeatNumbers( createStudentSeatNumberDto );
  }

  @Get()
  findAll ()
  {
    return this.controlMissionService.findAll();
  }

  @Get( 'school/:schoolId/education-year/:educationYearId' )
  findAllByEducationYearIdAndSchoolId ( @Param( 'schoolId' ) schoolId: string, @Param( 'educationYearId' ) educationYearId: string )
  {
    return this.controlMissionService.findAllByEducationYearIdAndSchoolId( +schoolId, +educationYearId );
  }

  @Get( 'school/:schoolId' )
  findAllBySchoolId ( @Param( 'schoolId' ) schoolId: string )
  {
    return this.controlMissionService.findAllBySchoolId( +schoolId );
  }

  @Get( 'education-year/:educationYearId' )
  findAllByEducationYearId ( @Param( 'educationYearId' ) educationYearId: string )
  {
    return this.controlMissionService.findAllByEducationYearId( +educationYearId );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateControlMissionDto: UpdateControlMissionDto )
  {
    return this.controlMissionService.update( +id, updateControlMissionDto );
  }

  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.remove( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.activate( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.deactivate( +id );
  }
}
