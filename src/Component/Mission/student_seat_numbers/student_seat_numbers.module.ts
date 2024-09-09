import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { StudentSeatNumbersController } from './student_seat_numbers.controller';
import { StudentSeatNumbersService } from './student_seat_numbers.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentSeatNumbersController],
  providers: [StudentSeatNumbersService],
})
export class StudentSeatNumbersModule {}
