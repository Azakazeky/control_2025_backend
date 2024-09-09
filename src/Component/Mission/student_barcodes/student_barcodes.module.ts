import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { StudentBarcodesController } from './student_barcodes.controller';
import { StudentBarcodesService } from './student_barcodes.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentBarcodesController],
  providers: [StudentBarcodesService],
})
export class StudentBarcodesModule {}
