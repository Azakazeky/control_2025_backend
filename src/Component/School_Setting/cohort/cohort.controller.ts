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
import { CohortService } from './cohort.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';

@UseGuards( JwtAuthGuard )
@ApiTags( 'cohort' )
@Controller( 'cohort' )
export class CohortController
{
  constructor ( private readonly cohortService: CohortService ) { }
  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @Post()
  create ( @Body() createCohortDto: CreateCohortDto, @Req() req: Request )
  {
    return this.cohortService.create(
      createCohortDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Get()
  findAll ()
  {
    return this.cohortService.findAll();
  }

  @Get( 'school-type' )
  findAllBySchoolType ( @Req() req: Request )
  {
    const id = req.headers[ 'user' ][ 'schoolId' ];
    return this.cohortService.findAllBySchoolId( +id );
  }
  @Get( 'school/:id' )
  findAllBySchoolTypeId ( @Param( 'id' ) id: string )
  {
    return this.cohortService.findAllBySchoolId( +id );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.cohortService.findOne( +id );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @ApiBody( { type: [ AddSubjectsToCohort ] } )
  @Post( 'Connect-Subject/:id' )
  async addSubjects (
    @Param( 'id' ) id: string,
    @Body() addSubjectsToCohort: [ number ],
  )
  {
    return this.cohortService.addSubjects( +id, addSubjectsToCohort );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @ApiBody( { type: [ AddSubjectsToCohort ] } )
  @Post( 'disconnect-Subject/:id' )
  async removeSubjectFromCohort (
    @Param( 'id' ) id: string,
    @Body() subjectId: number,
  )
  {
    return this.cohortService.removeSubjects( +id, subjectId );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @Patch( ':id' )
  update (
    @Param( 'id' ) id: string,
    @Body() updateCohortDto: UpdateCohortDto,
    @Req() req: Request,
  )
  {
    return this.cohortService.update(
      +id,
      updateCohortDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.cohortService.remove( +id );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.cohortService.activate( +id );
  }

  @Roles( Role.SuperAdmin, Role.ControlOfficer )
  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.cohortService.deactivate( +id );
  }
}
