import { Module } from '@nestjs/common';
import { StudentSeatNumbersService } from './student_seat_numbers.service';
import { StudentSeatNumbersController } from './student_seat_numbers.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [StudentSeatNumbersController],
  providers: [StudentSeatNumbersService, PrismaService],
})
export class StudentSeatNumbersModule {}
