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
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolsService } from './schools.service';

@UseGuards(JwtAuthGuard)
@ApiTags('School & Grades')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new school.
   * @param createSchoolDto the school data to be created
   * @returns the newly created school
   */
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  /**
   * Retrieves all schools associated with the user.
   * @param request the request object
   * @returns all schools associated with the user
   */
  findAll(@Req() request) {
    return this.schoolsService.findAllByUser(request.user.userId);
  }

  // @Roles( Role.SuperAdmin )
  @Get('all')
  /**
   * Retrieves all schools.
   * @returns all schools
   */
  findAllschools() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single school by its id.
   * @param id the school id
   * @returns the school with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a school.
   * @param id the school id
   * @param updateSchoolDto the school data to be updated
   * @param req the request object
   * @returns the updated school
   */
  update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Req() req: Request,
  ) {
    return this.schoolsService.update(
      +id,
      updateSchoolDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a school.
   * @param id the school id
   * @returns the removed school
   */
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a school.
   * @param id the school id
   * @returns the activated school
   * @throws {NotFoundException} If no school with the given id is found.
   */
  activate(@Param('id') id: string) {
    return this.schoolsService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a school.
   * @param id the school id
   * @returns the deactivated school
   * @throws {NotFoundException} If no school with the given id is found.
   */
  deactivate(@Param('id') id: string) {
    return this.schoolsService.deactivate(+id);
  }
}
