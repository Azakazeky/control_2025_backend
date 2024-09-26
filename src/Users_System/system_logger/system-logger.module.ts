import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { SystemLoggerController } from './system-logger.controller';
import { SystemLoggerService } from './system-logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [SystemLoggerController],
  providers: [SystemLoggerService],
})
export class SystemLoggerModule {}
