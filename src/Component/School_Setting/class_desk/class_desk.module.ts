import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../Common/Db/prisma.module';
import { ClassDeskController } from './class_desk.controller';
import { ClassDeskService } from './class_desk.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClassDeskController],
  providers: [ClassDeskService],
})
export class ClassDeskModule {}
