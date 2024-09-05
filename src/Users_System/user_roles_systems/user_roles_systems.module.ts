import { Module } from '@nestjs/common';
import { UserRolesSystemsService } from './user_roles_systems.service';
import { UserRolesSystemsController } from './user_roles_systems.controller';
import { PrismaService } from 'src/Common/Db/prisma.service';

@Module({
  controllers: [UserRolesSystemsController],
  providers: [UserRolesSystemsService, PrismaService],
  exports: [UserRolesSystemsService],
})
export class UserRolesSystemsModule {}
