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
  /**
   * Creates a new school type.
   * @param createSchoolTypeDto the school type data to be created
   * @returns the newly created school type
   */
  async create(@Body() createSchoolTypeDto: CreateSchoolTypeDto) {
    console.log('createSchoolTypeDto');
    return await this.schoolTypeService.create(1, createSchoolTypeDto);
  }

  @Get()
  /**
   * Retrieves all school types.
   * @returns an array of school types
   */
  findAll() {
    return this.schoolTypeService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single school type by its id.
   * @param id the school type id
   * @returns the school type with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.schoolTypeService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates a school type.
   * @param id the school type id
   * @param updateSchoolTypeDto the school type data to be updated
   * @returns the updated school type
   */
  update(
    @Param('id') id: string,
    @Body() updateSchoolTypeDto: UpdateSchoolTypeDto,
  ) {
    return this.schoolTypeService.update(+id, updateSchoolTypeDto);
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a school type.
   * @param id the school type id
   * @returns the deleted school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  remove(@Param('id') id: string) {
    return this.schoolTypeService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a school type.
   * @param id the school type id
   * @returns the activated school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  activate(@Param('id') id: string) {
    return this.schoolTypeService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a school type.
   * @param id the school type id
   * @returns the deactivated school type
   * @throws {NotFoundException} If no school type with the given id is found.
   */
  deactivate(@Param('id') id: string) {
    return this.schoolTypeService.deactivate(+id);
  }
}
