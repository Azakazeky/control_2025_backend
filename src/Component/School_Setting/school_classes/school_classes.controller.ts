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
import { CreateSchoolClassDto } from './dto/create-school_class.dto';
import { UpdateSchoolClassDto } from './dto/update-school_class.dto';
import { SchoolClassesService } from './school_classes.service';
@UseGuards(JwtAuthGuard)
@ApiTags('School-Classes')
@Controller('school-classes')
export class SchoolClassesController {
  constructor(private readonly schoolClassesService: SchoolClassesService) {}
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Post()
  /**
   * Creates a new school class.
   * @param createSchoolClassDto the school class data to be created
   * @param req the request object
   * @returns the newly created school class
   */
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
  /**
   * Retrieves all school classes.
   * @returns all school classes
   */
  findAll() {
    return this.schoolClassesService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single school class by id.
   * @param id the school class id
   * @returns the school class with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.schoolClassesService.findOne(+id);
  }

  // ControlSystem
  @Get('school')
  /**
   * Retrieves all school classes associated with the user's school.
   * @param req the request object
   * @returns all school classes associated with the user's school
   */
  findBySchoolId(@Req() req: Request) {
    const id = req.headers['user']['schoolId'];
    return this.schoolClassesService.findBySchool(+id);
  }
  @Get('school/:id')
  /**
   * Retrieves all school classes associated with the specified school id.
   * @param id the school id
   * @returns all school classes associated with the specified school id
   */
  findAllBySchoolId(@Param('id') id: string) {
    return this.schoolClassesService.findBySchool(+id);
  }
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Patch(':id')
  /**
   * Updates a school class.
   * @param id the school class id
   * @param updateSchoolClassDto the school class data to be updated
   * @param req the request object
   * @returns the updated school class
   */
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
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Delete(':id')
  /**
   * Removes a school class.
   * @param id the school class id
   * @returns the deleted school class
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.schoolClassesService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a school class.
   * @param id the school class id
   * @returns the activated school class
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  activate(@Param('id') id: string) {
    return this.schoolClassesService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a school class.
   * @param id the school class id
   * @returns the deactivated school class
   * @throws {NotFoundException} If no school class with the given id is found.
   */
  deactivate(@Param('id') id: string) {
    return this.schoolClassesService.deactivate(+id);
  }
}
