import
{
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
import { ControlMissionService } from './control_mission.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { CreateStudentSeatNumberDto } from './dto/create-student-seat-numbers.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@UseGuards( JwtAuthGuard )
@ApiTags( 'Control-Mission' )
@Controller( 'control-mission' )
export class ControlMissionController
{
  constructor ( private readonly controlMissionService: ControlMissionService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create (
    @Body() createControlMissionDto: CreateControlMissionDto,
    @Req() req: Request,
  )
  {
    return this.controlMissionService.create(
      createControlMissionDto,
      req.headers[ 'user' ][ 'userId' ],
      req.headers[ 'user' ][ 'Schools_ID' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @ApiBody( { type: CreateStudentSeatNumberDto } )
  @Post( 'student-seat-numbers' )
  createStudentSeatNumbers (
    @Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto,
  )
  {
    return this.controlMissionService.createStudentSeatNumbers(
      createStudentSeatNumberDto,
    );
  }

  @Get()
  findAll ()
  {
    return this.controlMissionService.findAll();
  }

  @Get( 'school/:schoolId/education-year/:educationYearId' )
  findAllByEducationYearIdAndSchoolId (
    @Param( 'educationYearId' ) educationYearId: string,
    @Req() req: Request,
  )
  {
    return this.controlMissionService.findAllByEducationYearIdAndSchoolId(
      +req.headers[ 'user' ][ 'schoolId' ],
      +educationYearId,
    );
  }

  @Get( 'schoolId/' )
  findAllBySchoolId ( @Req() req: Request )
  {
    return this.controlMissionService.findAllBySchoolId(
      +req.headers[ 'user' ][ 'Schools_ID' ],
    );
  }

  @Get( 'grades/:cmid' )
  findGradesAllByid ( @Param( 'cmid' ) cmid: string )
  {
    return this.controlMissionService.findGradesByCMID( +cmid );
  }

  @Get( 'education-year/:educationYearId' )
  findAllByEducationYearId ( @Param( 'educationYearId' ) educationYearId: string )
  {
    return this.controlMissionService.findAllByEducationYearId(
      +educationYearId,
    );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( ':id' )
  update (
    @Param( 'id' ) id: string,
    @Body() updateControlMissionDto: UpdateControlMissionDto,
    @Req() req: Request,
  )
  {
    return this.controlMissionService.update(
      +id,
      updateControlMissionDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.controlMissionService.remove( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string, @Req() req: Request )
  {
    return this.controlMissionService.activate(
      +id,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string, @Req() req: Request )
  {
    return this.controlMissionService.deactivate(
      +id,
      req.headers[ 'user' ][ 'userId' ],
    );
  }
}
