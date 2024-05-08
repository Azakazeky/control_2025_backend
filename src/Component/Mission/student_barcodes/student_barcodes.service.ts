import { Injectable } from '@nestjs/common';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';

@Injectable()
export class StudentBarcodesService {
  create(createStudentBarcodeDto: CreateStudentBarcodeDto) {
    return 'This action adds a new studentBarcode';
  }

  findAll() {
    return `This action returns all studentBarcodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentBarcode`;
  }

  update(id: number, updateStudentBarcodeDto: UpdateStudentBarcodeDto) {
    return `This action updates a #${id} studentBarcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentBarcode`;
  }
}
