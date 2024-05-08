import { Module } from '@nestjs/common';
import { SchoolTypeService } from './school_type.service';
import { SchoolTypeController } from './school_type.controller';

@Module({
  controllers: [SchoolTypeController],
  providers: [SchoolTypeService],
})
export class SchoolTypeModule {}
