import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateProctorDto } from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';
import { ProctorService } from './proctor.service';
@UseGuards( JwtAuthGuard )
@ApiTags( "proctor" )
@Controller( 'proctor' )
export class ProctorController
{
  constructor ( private readonly proctorService: ProctorService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  async create ( @Body() createProctorDto: CreateProctorDto )
  {
    return this.proctorService.create( createProctorDto );
  }

  @Get()
  async findAll ()
  {
    return this.proctorService.findAll();
  }

  @Get( ':id' )
  async findOne ( @Param( 'id' ) id: string )
  {
    return this.proctorService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  async update ( @Param( 'id' ) id: string, @Body() updateProctorDto: UpdateProctorDto )
  {
    return this.proctorService.update( +id, updateProctorDto );
  }

  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  async remove ( @Param( 'id' ) id: string )
  {
    return this.proctorService.remove( +id );
  }
}
