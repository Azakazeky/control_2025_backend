import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentBarcodesService } from './student_barcodes.service';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';

@Controller('student-barcodes')
export class StudentBarcodesController {
  constructor(private readonly studentBarcodesService: StudentBarcodesService) {}

  @Post()
  create(@Body() createStudentBarcodeDto: CreateStudentBarcodeDto) {
    return this.studentBarcodesService.create(createStudentBarcodeDto);
  }

  @Get()
  findAll() {
    return this.studentBarcodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentBarcodesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentBarcodeDto: UpdateStudentBarcodeDto) {
    return this.studentBarcodesService.update(+id, updateStudentBarcodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentBarcodesService.remove(+id);
  }
}
