import { Module } from '@nestjs/common';
import { CohortService } from './cohort.service';
import { CohortController } from './cohort.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [CohortController],
  providers: [CohortService, PrismaService],
})
export class CohortModule {}
