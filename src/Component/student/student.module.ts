import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
  exports: [StudentService],
  imports: [],
})
export class StudentModule {}
