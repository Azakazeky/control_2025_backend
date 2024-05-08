import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducationYearService } from './education_year.service';
import { CreateEducationYearDto } from './dto/create-education_year.dto';
import { UpdateEducationYearDto } from './dto/update-education_year.dto';

@Controller('education-year')
export class EducationYearController {
  constructor(private readonly educationYearService: EducationYearService) {}

  @Post()
  create(@Body() createEducationYearDto: CreateEducationYearDto) {
    return this.educationYearService.create(createEducationYearDto);
  }

  @Get()
  findAll() {
    return this.educationYearService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationYearService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEducationYearDto: UpdateEducationYearDto) {
    return this.educationYearService.update(+id, updateEducationYearDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationYearService.remove(+id);
  }
}
