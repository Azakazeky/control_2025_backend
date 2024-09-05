import {
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
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';
import { SchoolClassesService } from './school_classes.service';
@UseGuards(JwtAuthGuard)
@ApiTags('School-Classes')
@Controller('school-classes')
export class SchoolClassesController {
  constructor(private readonly schoolClassesService: SchoolClassesService) {}
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Post()
  create(
    @Body() createSchoolClassDto: CreateSchoolClassDto,
    @Req() req: Request,
  ) {
    return this.schoolClassesService.create(
      createSchoolClassDto,
      req.headers['user']['userId'],
      req.headers['user']['schoolId'],
    );
  }

  @Get()
  findAll() {
    return this.schoolClassesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolClassesService.findOne(+id);
  }

  // ControlSystem
  @Get('school')
  findBySchoolId(@Req() req: Request) {
    const id = req.headers['user']['schoolId'];
    return this.schoolClassesService.findBySchool(+id);
  }
  @Get('school/:id')
  findAllBySchoolId(@Param('id') id: string) {
    return this.schoolClassesService.findBySchool(+id);
  }
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchoolClassDto: UpdateSchoolClassDto,
    @Req() req: Request,
  ) {
    return this.schoolClassesService.update(
      +id,
      updateSchoolClassDto,
      req.headers['user']['userId'],
    );
  }
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolClassesService.remove(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.schoolClassesService.activate(+id);
  }

  @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.schoolClassesService.deactivate(+id);
  }
}
