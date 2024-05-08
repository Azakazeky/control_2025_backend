import { Module } from '@nestjs/common';
import { StudentSeatNumbersService } from './student_seat_numbers.service';
import { StudentSeatNumbersController } from './student_seat_numbers.controller';

@Module({
  controllers: [StudentSeatNumbersController],
  providers: [StudentSeatNumbersService],
})
export class StudentSeatNumbersModule {}
