import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { ExamRoomsController } from './exam_rooms.controller';
import { ExamRoomsService } from './exam_rooms.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExamRoomsController],
  providers: [ExamRoomsService],
})
export class ExamRoomsModule {}
