import { Module } from '@nestjs/common';
import { EducationYearService } from './education_year.service';
import { EducationYearController } from './education_year.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [EducationYearController],
  providers: [EducationYearService,PrismaService],
})
export class EducationYearModule {}
