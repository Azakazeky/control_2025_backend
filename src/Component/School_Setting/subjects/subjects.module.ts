import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../Common/Db/prisma.module';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
@Module({
  imports: [PrismaModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
