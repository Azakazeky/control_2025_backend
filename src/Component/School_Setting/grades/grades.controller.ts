import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesService } from './grades.service';


@UseGuards( JwtAuthGuard )
@ApiTags( "School & Grades" )
@UseGuards( PrismaExceptionFilter )


@Controller( 'grades' )
export class GradesController
{
  constructor ( private readonly gradesService: GradesService ) { }
  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createGradeDto: CreateGradeDto )
  {
    return this.gradesService.create( createGradeDto );
  }

  @Get()
  findAll ()
  {
    return this.gradesService.findAll();
  }

  @Get( 'school/:id' )
  findAllBySchoolId ( @Param( 'id' ) id: string )
  {
    return this.gradesService.findAllBySchoolId( +id );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.gradesService.findOne( +id );
  }
  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateGradeDto: UpdateGradeDto )
  {
    return this.gradesService.update( +id, updateGradeDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.gradesService.remove( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.gradesService.activate( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.gradesService.deactivate( +id );
  }
}
