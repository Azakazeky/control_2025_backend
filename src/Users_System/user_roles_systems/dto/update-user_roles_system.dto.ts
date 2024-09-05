import { PartialType } from '@nestjs/swagger';
import { CreateUserRolesSystemDto } from './create-user_roles_system.dto';

export class UpdateUserRolesSystemDto extends PartialType(
  CreateUserRolesSystemDto,
) {}
