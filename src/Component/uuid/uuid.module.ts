import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { UuidController } from './uuid.controller';
import { UuidService } from './uuid.service';

@Module( {
  controllers: [ UuidController ],
  providers: [ UuidService, PrismaService ],
} )
export class UuidModule { }
