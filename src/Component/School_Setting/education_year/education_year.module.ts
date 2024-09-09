import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { EducationYearController } from './education_year.controller';
import { EducationYearService } from './education_year.service';

@Module({
  imports: [PrismaModule],
  controllers: [EducationYearController],
  providers: [EducationYearService],
})
export class EducationYearModule {}
