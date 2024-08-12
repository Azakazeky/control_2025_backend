import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto, CreateUserHasRolesDto, CreateUserHasSchoolsDto } from './create-user.dto';

export class UpdateUserDto extends PartialType( CreateUserDto ) {

    @ApiProperty()
    @IsString()
    OldPassword: string;
    @ApiProperty()
    @IsString()
    NewPassword: string;
}
export class UpdateUserHasRolesDto extends PartialType( CreateUserHasRolesDto ) { }
export class UpdateUserHasSchoolsDto extends PartialType( CreateUserHasSchoolsDto ) { }
