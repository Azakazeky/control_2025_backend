import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { CohortController } from './cohort.controller';
import { CohortService } from './cohort.service';

@Module({
  imports: [PrismaModule],
  controllers: [CohortController],
  providers: [CohortService],
})
export class CohortModule {}
