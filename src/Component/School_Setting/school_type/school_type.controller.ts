import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchoolTypeService } from './school_type.service';
import { CreateSchoolTypeDto } from './dto/create-school_type.dto';
import { UpdateSchoolTypeDto } from './dto/update-school_type.dto';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';

@Controller('school-type')
export class SchoolTypeController {
  constructor(private readonly schoolTypeService: SchoolTypeService) {}

  
  @Roles(Role.SuperAdmin)
  @Post()
  create(@Body() createSchoolTypeDto: CreateSchoolTypeDto) {
    return this.schoolTypeService.create(createSchoolTypeDto);
  }

  @Get()
  findAll() {
    return this.schoolTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolTypeService.findOne(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolTypeDto: UpdateSchoolTypeDto) {
    return this.schoolTypeService.update(+id, updateSchoolTypeDto);
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolTypeService.remove(+id);
  }
}
