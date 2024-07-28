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
  @Roles(Role.SuperAdmin)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }
  @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }
  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'activate/:id' )
  // activate ( @Param( 'id' ) id: string )
  // {
  //   return this.subjectsService.activate( +id );
  // }

  // @Roles( Role.SuperAdmin )

  // @Patch( 'deactivate/:id' )
  // deactivate ( @Param( 'id' ) id: string )
  // {
  //   return this.subjectsService.deactivate( +id );
  // }
}
