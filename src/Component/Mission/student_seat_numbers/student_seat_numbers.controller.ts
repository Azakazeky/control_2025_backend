import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentSeatNumbersService } from './student_seat_numbers.service';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';

@Controller('student-seat-numbers')
export class StudentSeatNumbersController {
  constructor(private readonly studentSeatNumbersService: StudentSeatNumbersService) {}

  @Post()
  create(@Body() createStudentSeatNumberDto: CreateStudentSeatNumberDto) {
    return this.studentSeatNumbersService.create(createStudentSeatNumberDto);
  }

  @Get()
  findAll() {
    return this.studentSeatNumbersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentSeatNumbersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentSeatNumberDto: UpdateStudentSeatNumberDto) {
    return this.studentSeatNumbersService.update(+id, updateStudentSeatNumberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentSeatNumbersService.remove(+id);
  }
}
