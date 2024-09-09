import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { StageController } from './stage.controller';
import { StageService } from './stage.service';

@Module({
  imports: [PrismaModule],
  controllers: [StageController],
  providers: [StageService],
})
export class StageModule {}
