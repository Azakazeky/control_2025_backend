import { PartialType } from '@nestjs/swagger';
import { CreateStudentBarcodeDto } from './create-student_barcode.dto';

export class UpdateStudentBarcodeDto extends PartialType(CreateStudentBarcodeDto) {}
