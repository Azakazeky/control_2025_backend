import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { StageService } from './stage.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Stage" )
@UseGuards( PrismaExceptionFilter )
@Controller( 'stage' )
export class StageController
{
  constructor ( private readonly stageService: StageService ) { }

  @Post()
  create ( @Body() createStageDto: CreateStageDto )
  {
    return this.stageService.create( createStageDto );
  }

  @Get()
  findAll ()
  {
    return this.stageService.findAll();
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.stageService.findOne( +id );
  }

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateStageDto: UpdateStageDto )
  {
    return this.stageService.update( +id, updateStageDto );
  }

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.stageService.remove( +id );
  }
}
