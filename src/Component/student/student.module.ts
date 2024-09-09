import { Module } from '@nestjs/common';
import { PrismaModule } from '../../Common/Db/prisma.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
@Module({
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
  imports: [PrismaModule],
})
export class StudentModule {}
