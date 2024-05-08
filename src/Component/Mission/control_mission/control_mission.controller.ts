import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ControlMissionService } from './control_mission.service';
import { CreateControlMissionDto } from './dto/create-control_mission.dto';
import { UpdateControlMissionDto } from './dto/update-control_mission.dto';

@Controller('control-mission')
export class ControlMissionController {
  constructor(private readonly controlMissionService: ControlMissionService) {}

  @Post()
  create(@Body() createControlMissionDto: CreateControlMissionDto) {
    return this.controlMissionService.create(createControlMissionDto);
  }

  @Get()
  findAll() {
    return this.controlMissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlMissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControlMissionDto: UpdateControlMissionDto) {
    return this.controlMissionService.update(+id, updateControlMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlMissionService.remove(+id);
  }
}
