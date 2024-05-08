import { Module } from '@nestjs/common';
import { SchoolClassesService } from './school_classes.service';
import { SchoolClassesController } from './school_classes.controller';

@Module({
  controllers: [SchoolClassesController],
  providers: [SchoolClassesService],
})
export class SchoolClassesModule {}
