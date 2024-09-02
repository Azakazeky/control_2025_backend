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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolsService } from './schools.service';

@UseGuards( JwtAuthGuard )
@ApiTags( 'School & Grades' )
@Controller( 'schools' )
export class SchoolsController
{
  constructor ( private readonly schoolsService: SchoolsService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create ( @Body() createSchoolDto: CreateSchoolDto )
  {
    return this.schoolsService.create( createSchoolDto );
  }

  @Get()
  findAll ( @Req() request )
  {
    return this.schoolsService.findAllByUser( request.user.userId );
  }

  // @Roles( Role.SuperAdmin )
  @Get( 'all' )
  findAllschools ()
  {
    return this.schoolsService.findAll();
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.schoolsService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( ':id' )
  update (
    @Param( 'id' ) id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Req() req: Request,
  )
  {
    return this.schoolsService.update(
      +id,
      updateSchoolDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.schoolsService.remove( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.schoolsService.activate( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.schoolsService.deactivate( +id );
  }
}
