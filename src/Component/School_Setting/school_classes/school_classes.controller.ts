import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchoolClassesService } from './school_classes.service';
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';

@Controller('school-classes')
export class SchoolClassesController {
  constructor(private readonly schoolClassesService: SchoolClassesService) {}

  @Post()
  create(@Body() createSchoolClassDto: CreateSchoolClassDto) {
    return this.schoolClassesService.create(createSchoolClassDto);
  }

  @Get()
  findAll() {
    return this.schoolClassesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolClassesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolClassDto: UpdateSchoolClassDto) {
    return this.schoolClassesService.update(+id, updateSchoolClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolClassesService.remove(+id);
  }
}
