import { Module } from '@nestjs/common';
import { ExamRoomsService } from './exam_rooms.service';
import { ExamRoomsController } from './exam_rooms.controller';

@Module({
  controllers: [ExamRoomsController],
  providers: [ExamRoomsService],
})
export class ExamRoomsModule {}
