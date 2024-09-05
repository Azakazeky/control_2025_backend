import { Module } from '@nestjs/common';
import { SchoolClassesService } from './school_classes.service';
import { SchoolClassesController } from './school_classes.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [SchoolClassesController],
  providers: [SchoolClassesService, PrismaService],
  exports: [SchoolClassesService],
})
export class SchoolClassesModule {}
