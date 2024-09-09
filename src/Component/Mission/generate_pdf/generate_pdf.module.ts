import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { GeneratePdfController } from './generate_pdf.controller';
import { GeneratePdfService } from './generate_pdf.service';
import { PdfComponantModule } from './pdfComponant.module';

@Module({
  imports: [PrismaModule, PdfComponantModule],
  controllers: [GeneratePdfController],
  providers: [GeneratePdfService],
})
export class GeneratePdfModule {}
