import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { UserRolesSystemsController } from './user_roles_systems.controller';
import { UserRolesSystemsService } from './user_roles_systems.service';
@Module({
  imports: [PrismaModule],

  controllers: [UserRolesSystemsController],
  providers: [UserRolesSystemsService],
  exports: [UserRolesSystemsService],
})
export class UserRolesSystemsModule {}
