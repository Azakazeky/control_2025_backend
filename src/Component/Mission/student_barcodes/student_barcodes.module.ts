import { Module } from '@nestjs/common';
import { StudentBarcodesService } from './student_barcodes.service';
import { StudentBarcodesController } from './student_barcodes.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [StudentBarcodesController],
  providers: [StudentBarcodesService, PrismaService],
})
export class StudentBarcodesModule {}
