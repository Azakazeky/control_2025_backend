import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassDeskService } from './class_desk.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';

@Controller('class-desk')
export class ClassDeskController {
  constructor(private readonly classDeskService: ClassDeskService) {}

  @Post()
  create(@Body() createClassDeskDto: CreateClassDeskDto) {
    return this.classDeskService.create(createClassDeskDto);
  }

  @Get()
  findAll() {
    return this.classDeskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classDeskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDeskDto: UpdateClassDeskDto) {
    return this.classDeskService.update(+id, updateClassDeskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classDeskService.remove(+id);
  }
}
