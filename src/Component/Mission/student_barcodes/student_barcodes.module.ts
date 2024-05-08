import { Module } from '@nestjs/common';
import { StudentBarcodesService } from './student_barcodes.service';
import { StudentBarcodesController } from './student_barcodes.controller';

@Module({
  controllers: [StudentBarcodesController],
  providers: [StudentBarcodesService],
})
export class StudentBarcodesModule {}
