import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ProctorController } from './proctor.controller';
import { ProctorService } from './proctor.service';

@Module({
  controllers: [ProctorController],
  providers: [ProctorService, PrismaService],
})
export class ProctorModule {}
