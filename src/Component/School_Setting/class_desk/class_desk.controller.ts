import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { ClassDeskService } from './class_desk.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';
@UseGuards( JwtAuthGuard )
@ApiTags( "Class-Desk" )
@UseGuards( PrismaExceptionFilter )


@Controller( 'class-desk' )
export class ClassDeskController
{
  constructor ( private readonly classDeskService: ClassDeskService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create ( @Body() createClassDeskDto: CreateClassDeskDto )
  {
    return this.classDeskService.create( createClassDeskDto );
  }

  @Get()
  findAll ()
  {
    return this.classDeskService.findAll();
  }

  @Get( 'school/:id' )
  findAllBySchoolId ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.findAllschoolClassId( +id );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.findOne( +id );
  }
  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateClassDeskDto: UpdateClassDeskDto )
  {
    return this.classDeskService.update( +id, updateClassDeskDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.remove( +id );
  }
}
