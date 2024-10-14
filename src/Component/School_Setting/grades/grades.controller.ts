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
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesService } from './grades.service';

@UseGuards(JwtAuthGuard)
@ApiTags('School & Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // ControlSystem
  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Post()
  /**
   * Creates a new grade.
   * @param createGradeDto the grade data to be created
   * @param req the request object
   * @returns the newly created grade
   */
  create(@Body() createGradeDto: CreateGradeDto, @Req() req: Request) {
    return this.gradesService.create(createGradeDto);
  }

  // ControlSystem
  @Get()
  /**
   * Retrieves all grades.
   * @returns all grades
   */
  findAll() {
    return this.gradesService.findAll();
  }

  // ControlSystem
  @Get('school')
  /**
   * Retrieves all grades associated with a school.
   * @param req the request object
   * @returns all grades associated with the school
   */
  findAllBySchoolId(@Req() req: Request) {
    const id = req.headers['user']['schoolId'];

    return this.gradesService.findAllBySchoolId(+id);
  }
  @Get('school/:id')
  /**
   * Retrieves all grades associated with a school.
   * @param id the school id
   * @returns all grades associated with the school
   */
  findAllGradesBySchoolId(@Param('id') id: string) {
    return this.gradesService.findAllBySchoolId(+id);
  }

  // ControlSystem
  @Get(':id')
  /**
   * Retrieves a single grade by its id.
   * @param id the grade id
   * @returns the grade with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a grade.
   * @param id the grade id
   * @param updateGradeDto the grade data to be updated
   * @param req the request object
   * @returns the updated grade
   */
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
  /**
   * Removes a grade by its id.
   * @param id the grade id
   * @returns the deleted grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)

  @Patch('activate/:id')
  /**
   * Activates a grade.
   * @param id the grade id
   * @returns the activated grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  activate(@Param('id') id: string) {
    return this.gradesService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a grade.
   * @param id the grade id
   * @returns the deactivated grade
   * @throws {NotFoundException} If no grade with the given id is found.
   */
  deactivate(@Param('id') id: string) {
    return this.gradesService.deactivate(+id);
  }
}
