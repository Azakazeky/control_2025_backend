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
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesService } from './grades.service';

@UseGuards(JwtAuthGuard)
@ApiTags('School & Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // ControlSystem
  @Roles(Role.SuperAdmin, Role.ControlOfficer)
  @Post()
  create(@Body() createGradeDto: CreateGradeDto, @Req() req: Request) {
    return this.gradesService.create(createGradeDto);
  }

  // ControlSystem
  @Get()
  findAll() {
    return this.gradesService.findAll();
  }

  // ControlSystem
  @Get('school')
  findAllBySchoolId(@Req() req: Request) {
    const id = req.headers['user']['schoolId'];

    return this.gradesService.findAllBySchoolId(+id);
  }
  @Get('school/:id')
  findAllGradesBySchoolId(@Param('id') id: string) {
    return this.gradesService.findAllBySchoolId(+id);
  }

  // ControlSystem
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Req() req: Request,
  ) {
    return this.gradesService.update(
      +id,
      updateGradeDto,
      req.headers['user']['userId'],
    );
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.gradesService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.gradesService.deactivate(+id);
  }
}
