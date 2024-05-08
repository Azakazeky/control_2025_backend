import { Module } from '@nestjs/common';
import { EducationYearService } from './education_year.service';
import { EducationYearController } from './education_year.controller';

@Module({
  controllers: [EducationYearController],
  providers: [EducationYearService],
})
export class EducationYearModule {}
