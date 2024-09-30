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
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Subject')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  @Roles(Role.SuperAdmin, Role.OperationCO)
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: Request) {
    return this.subjectsService.create(
      createSubjectDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get('/school-type/:school_type_ID')
  findAllBySchoolTypeId(@Param('school_type_ID') school_type_ID: string) {
    return this.subjectsService.findAllBySchoolTypeId(+school_type_ID);
  }

  // ControlSystem
  @Get('controlMission/:id')
  findAllByControlMissionId(@Param('id') id: string) {
    return this.subjectsService.findAllByControlMissionId(+id);
  }

  @Get('/all-active')
  findAllActive() {
    return this.subjectsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }

  @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Req() req: Request,
  ) {
    return this.subjectsService.update(
      +id,
      updateSubjectDto,
      req.headers['user']['userId'],
    );
  }

  @Roles(Role.SuperAdmin, Role.OperationCO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  activate(@Param('id') id: string, @Req() req: Request) {
    return this.subjectsService.activate(+id, req.headers['user']['userId']);
  }
  @Patch('remove-school-type/:subject_ID/:school_type_ID')
  removeSchoolTypeFromSubject(
    @Param('subject_ID') id: number,
    @Param('school_type_ID') school_type_ID: number,
    @Req() req: Request,
  ) {
    return this.subjectsService.removeSchoolTypeFromSubject(
      +id,
      +school_type_ID,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string, @Req() req: Request) {
    return this.subjectsService.deactivate(+id, req.headers['user']['userId']);
  }
}
