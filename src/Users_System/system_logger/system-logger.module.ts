import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { SystemLoggerController } from './system-logger.controller';
import { SystemLoggerService } from './system-logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [SystemLoggerController],
  providers: [SystemLoggerService, AppService],
})
export class SystemLoggerModule {}
