import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSchoolTypeDto } from './dto/create-school_type.dto';
import { UpdateSchoolTypeDto } from './dto/update-school_type.dto';
import { SchoolTypeService } from './school_type.service';

// @UseGuards( JwtAuthGuard )
@ApiTags('School-Type')
@Controller('school-type')
export class SchoolTypeController {
  constructor(private readonly schoolTypeService: SchoolTypeService) {}
  // // @Roles(Role.SuperAdmin)
  @Post()
  async create(@Body() createSchoolTypeDto: CreateSchoolTypeDto) {
    console.log('createSchoolTypeDto');
    return await this.schoolTypeService.create(1, createSchoolTypeDto);
  }

  @Get()
  findAll() {
    return this.schoolTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolTypeService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchoolTypeDto: UpdateSchoolTypeDto,
  ) {
    return this.schoolTypeService.update(+id, updateSchoolTypeDto);
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolTypeService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.schoolTypeService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.schoolTypeService.deactivate(+id);
  }
}
