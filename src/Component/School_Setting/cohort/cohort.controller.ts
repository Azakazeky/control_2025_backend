import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CohortService } from './cohort.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';

@UseGuards( JwtAuthGuard )
@ApiTags( "cohort" )
@Controller( 'cohort' )
export class CohortController
{
  constructor ( private readonly cohortService: CohortService ) { }
  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createCohortDto: CreateCohortDto )
  {
    return this.cohortService.create( createCohortDto );
  }

  @Get()
  findAll ()
  {
    return this.cohortService.findAll();
  }

  @Get( 'school-type/:id' )
  findAllBySchoolType ( @Param( 'id' ) id: string )
  {
    return this.cohortService.findAllBySchoolType( +id );
  }


  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.cohortService.findOne( +id );
  }


  @Roles( Role.SuperAdmin )
  @ApiBody( { type: [ AddSubjectsToCohort ] } )
  @Post( 'Connect-Subject/:id' )
  async addSubjects ( @Param( 'id' ) id: string, @Body() addSubjectsToCohort: [ number ] )
  {
    return this.cohortService.addSubjects( +id, addSubjectsToCohort );
  }

  @Roles( Role.SuperAdmin )
  @ApiBody( { type: [ AddSubjectsToCohort ] } )
  @Post( 'disconnect-Subject/:id' )
  async removeSubjectFromCohort ( @Param( 'id' ) id: string, @Body() subjectId: number )
  {
    return this.cohortService.removeSubjects( +id, subjectId );
  }


  @Roles( Role.SuperAdmin )
  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateCohortDto: UpdateCohortDto )
  {
    return this.cohortService.update( +id, updateCohortDto );
  }

  @Roles( Role.SuperAdmin )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.cohortService.remove( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.cohortService.activate( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.cohortService.deactivate( +id );
  }
}
