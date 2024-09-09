import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { SchoolTypeController } from './school_type.controller';
import { SchoolTypeService } from './school_type.service';

@Module({
  imports: [PrismaModule],
  controllers: [SchoolTypeController],
  providers: [SchoolTypeService],
})
export class SchoolTypeModule {}
