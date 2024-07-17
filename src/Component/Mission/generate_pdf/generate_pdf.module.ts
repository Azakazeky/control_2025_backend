import { Module } from '@nestjs/common';
import { GeneratePdfService } from './generate_pdf.service';
import { GeneratePdfController } from './generate_pdf.controller';
import { ComponantServices } from './pdfComponant.services';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [GeneratePdfController],
  providers: [GeneratePdfService,ComponantServices,PrismaService],
})
export class GeneratePdfModule {}
