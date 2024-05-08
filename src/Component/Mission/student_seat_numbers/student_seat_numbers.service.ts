import { Injectable } from '@nestjs/common';
import { CreateStudentSeatNumberDto } from './dto/create-student_seat_number.dto';
import { UpdateStudentSeatNumberDto } from './dto/update-student_seat_number.dto';

@Injectable()
export class StudentSeatNumbersService {
  create(createStudentSeatNumberDto: CreateStudentSeatNumberDto) {
    return 'This action adds a new studentSeatNumber';
  }

  findAll() {
    return `This action returns all studentSeatNumbers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentSeatNumber`;
  }

  update(id: number, updateStudentSeatNumberDto: UpdateStudentSeatNumberDto) {
    return `This action updates a #${id} studentSeatNumber`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentSeatNumber`;
  }
}
