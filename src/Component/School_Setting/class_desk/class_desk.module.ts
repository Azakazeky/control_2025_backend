import { Module } from '@nestjs/common';
import { ClassDeskService } from './class_desk.service';
import { ClassDeskController } from './class_desk.controller';

@Module({
  controllers: [ClassDeskController],
  providers: [ClassDeskService],
})
export class ClassDeskModule {}
