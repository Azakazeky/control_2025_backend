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
  create(@Body() createEducationYearDto: CreateEducationYearDto) {
    return this.educationYearService.create(createEducationYearDto);
  }

  @Get()
  findAll() {
    return this.educationYearService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationYearService.findOne(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEducationYearDto: UpdateEducationYearDto,
  ) {
    return this.educationYearService.update(+id, updateEducationYearDto);
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
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
