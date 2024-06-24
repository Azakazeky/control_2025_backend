import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { StageController } from './stage.controller';
import { StageService } from './stage.service';

@Module( {
  controllers: [ StageController ],
  providers: [ StageService, PrismaService ],
} )
export class StageModule { }
