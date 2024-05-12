import { Module } from '@nestjs/common';
import { ExamRoomsService } from './exam_rooms.service';
import { ExamRoomsController } from './exam_rooms.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [ExamRoomsController],
  providers: [ExamRoomsService,PrismaService],
})
export class ExamRoomsModule {}
