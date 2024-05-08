import { PartialType } from '@nestjs/swagger';
import { CreateStudentSeatNumberDto } from './create-student_seat_number.dto';

export class UpdateStudentSeatNumberDto extends PartialType(CreateStudentSeatNumberDto) {}
