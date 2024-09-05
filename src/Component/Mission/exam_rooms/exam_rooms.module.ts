import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ExamRoomsController } from './exam_rooms.controller';
import { ExamRoomsService } from './exam_rooms.service';

@Module({
  controllers: [ExamRoomsController],
  providers: [ExamRoomsService, PrismaService],
})
export class ExamRoomsModule {}
