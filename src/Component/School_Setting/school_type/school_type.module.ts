import { Module } from '@nestjs/common';
import { SchoolTypeService } from './school_type.service';
import { SchoolTypeController } from './school_type.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [SchoolTypeController],
  providers: [SchoolTypeService,PrismaService],
})
export class SchoolTypeModule {}
