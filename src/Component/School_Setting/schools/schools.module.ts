import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  imports: [PrismaModule],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
