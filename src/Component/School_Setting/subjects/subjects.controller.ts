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
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Subject')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Post()
  /**
   * Creates a new subject.
   * @param createSubjectDto the subject data to be created
   * @param req the request object
   * @returns the newly created subject
   */
  create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: Request) {
    return this.subjectsService.create(
      createSubjectDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  /**
   * Retrieves all subjects from the database.
   * @returns an array of subjects
   */
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get('/school-type/:school_type_ID')
  /**
   * Retrieves all subjects associated with the specified school type id.
   * @param school_type_ID the school type id
   * @returns all subjects associated with the specified school type id
   */
  findAllBySchoolTypeId(@Param('school_type_ID') school_type_ID: string) {
    return this.subjectsService.findAllBySchoolTypeId(+school_type_ID);
  }

  // ControlSystem
  @Get('controlMission/:id')
  /**
   * Retrieves all subjects associated with the specified control mission id.
   * @param id the control mission id
   * @returns all subjects associated with the specified control mission id
   */
  findAllByControlMissionId(@Param('id') id: string) {
    return this.subjectsService.findAllByControlMissionId(+id);
  }

  @Get('/all-active')
  /**
   * Retrieves all active subjects from the database.
   * @returns an array of active subjects
   */
  findAllActive() {
    return this.subjectsService.findAllActive();
  }

  @Get(':id')
  /**
   * Retrieves a single subject by its id.
   * @param id the subject id
   * @returns the subject with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch(':id')
  /**
   * Updates a subject.
   * @param id the subject id
   * @param updateSubjectDto the subject data to be updated
   * @param req the request object
   * @returns the updated subject
   */
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

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Delete(':id')
  /**
   * Removes a subject.
   * @param id the subject id
   * @returns the deleted subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a subject.
   * @param id the subject id
   * @param req the request object
   * @returns the activated subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
  activate(@Param('id') id: string, @Req() req: Request) {
    return this.subjectsService.activate(+id, req.headers['user']['userId']);
  }
  @Patch('remove-school-type/:subject_ID/:school_type_ID')
  /**
   * Removes a school type from a subject.
   * @param subject_ID the subject id
   * @param school_type_ID the school type id
   * @param req the request object
   * @returns the updated subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
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
  /**
   * Deactivates a subject.
   * @param id the subject id
   * @param req the request object
   * @returns the deactivated subject
   * @throws {NotFoundException} If no subject with the given id is found.
   */
  deactivate(@Param('id') id: string, @Req() req: Request) {
    return this.subjectsService.deactivate(+id, req.headers['user']['userId']);
  }
}
