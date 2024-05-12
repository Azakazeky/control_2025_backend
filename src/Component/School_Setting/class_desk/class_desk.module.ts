import { Module } from '@nestjs/common';
import { ClassDeskService } from './class_desk.service';
import { ClassDeskController } from './class_desk.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [ClassDeskController],
  providers: [ClassDeskService,PrismaService],
})
export class ClassDeskModule {}
