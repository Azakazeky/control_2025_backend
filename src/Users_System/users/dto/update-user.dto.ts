import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, CreateUserHasRolesDto, CreateUserHasSchoolsDto } from './create-user.dto';

export class UpdateUserDto extends PartialType( CreateUserDto ) { }
export class UpdateUserHasRolesDto extends PartialType( CreateUserHasRolesDto ) { }
export class UpdateUserHasSchoolsDto extends PartialType( CreateUserHasSchoolsDto ) { }
