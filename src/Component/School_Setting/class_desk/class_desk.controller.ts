import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { ClassDeskService } from './class_desk.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { CreateManyClassDeskDto } from './dto/create-many-class-desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';
@UseGuards( JwtAuthGuard )
@ApiTags( "Class-Desk" )


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
  @Roles( Role.SuperAdmin )
  @Post( 'many' )
  createMany ( @Body() createManyClassDeskDto: CreateManyClassDeskDto )
  {
    return this.classDeskService.createMany( createManyClassDeskDto );
  }

  @Get()
  findAll ()
  {
    return this.classDeskService.findAll();
  }

  // ControlSystem
  @Get( 'class/:id' )
  findAllByClassId ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.findAllByClassId( +id );
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

  @Delete( 'class/:id' )
  removeAllByClassId ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.removeAllByClassId( +id );
  }
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.classDeskService.remove( +id );
  }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'activate/:id' )
  // activate ( @Param( 'id' ) id: string )
  // {
  //   return this.classDeskService.activate( +id );
  // }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'deactivate/:id' )
  // deactivate ( @Param( 'id' ) id: string )
  // {
  //   return this.classDeskService.deactivate( +id );
  // }
}
