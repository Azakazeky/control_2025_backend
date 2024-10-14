import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateEducationYearDto } from './dto/create-education_year.dto';
import { UpdateEducationYearDto } from './dto/update-education_year.dto';
import { EducationYearService } from './education_year.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Education-Years')
@Controller('education-year')
export class EducationYearController {
  constructor(private readonly educationYearService: EducationYearService) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new education year.
   * @param createEducationYearDto the education year data to be created
   * @returns the newly created education year
   */
  create(@Body() createEducationYearDto: CreateEducationYearDto) {
    return this.educationYearService.create(createEducationYearDto);
  }

  @Get()
  /**
   * Retrieves all education years.
   * @returns an array of education years
   */
  findAll() {
    return this.educationYearService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves an education year by its id.
   * @param id the education year id
   * @returns the education year
   */
  findOne(@Param('id') id: string) {
    return this.educationYearService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  /**
   * Updates an education year by its id.
   * @param id the education year id
   * @param updateEducationYearDto the education year data to be updated
   * @returns the updated education year
   */
  update(
    @Param('id') id: string,
    @Body() updateEducationYearDto: UpdateEducationYearDto,
  ) {
    return this.educationYearService.update(+id, updateEducationYearDto);
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes an education year by its id.
   * @param id the education year id
   * @returns the deleted education year
   */
  remove(@Param('id') id: string) {
    return this.educationYearService.remove(+id);
  }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'activate/:id' )
  // activate ( @Param( 'id' ) id: string )
  // {
  //   return this.educationYearService.activate( +id );
  // }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'deactivate/:id' )
  // deactivate ( @Param( 'id' ) id: string )
  // {
  //   return this.educationYearService.deactivate( +id );
  // }
}
