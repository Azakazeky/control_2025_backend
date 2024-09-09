import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { ProctorController } from './proctor.controller';
import { ProctorService } from './proctor.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProctorController],
  providers: [ProctorService],
})
export class ProctorModule {}
