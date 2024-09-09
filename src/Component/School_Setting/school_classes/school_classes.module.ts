import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { SchoolClassesController } from './school_classes.controller';
import { SchoolClassesService } from './school_classes.service';

@Module({
  imports: [PrismaModule],
  controllers: [SchoolClassesController],
  providers: [SchoolClassesService],
  exports: [SchoolClassesService],
})
export class SchoolClassesModule {}
