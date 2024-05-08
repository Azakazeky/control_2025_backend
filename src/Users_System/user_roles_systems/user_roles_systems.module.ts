import { Module } from '@nestjs/common';
import { UserRolesSystemsService } from './user_roles_systems.service';
import { UserRolesSystemsController } from './user_roles_systems.controller';

@Module({
  controllers: [UserRolesSystemsController],
  providers: [UserRolesSystemsService],
})
export class UserRolesSystemsModule {}
