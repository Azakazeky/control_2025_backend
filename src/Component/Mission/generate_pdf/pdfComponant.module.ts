import { Module } from '@nestjs/common';
import { ComponantServices } from './pdfComponant.services';

@Module({
  providers: [ComponantServices],
  exports: [ComponantServices],
})
export class PdfComponantModule {}
