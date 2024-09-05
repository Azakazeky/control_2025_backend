import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  School_Id: number;

  @ApiProperty()
  @IsString()
  Full_Name: string;

  @ApiProperty()
  @IsString()
  User_Name: string;

  @ApiProperty()
  @IsString()
  Password: string;

  @ApiProperty()
  @IsString()
  IsFloorManager: string;

  @ApiProperty()
  @IsNumber()
  Type: number;

  @ApiProperty()
  @IsNumber()
  LastSelectSchoolId: number;
}

export class CreateUserHasRolesDto {
  @ApiProperty()
  @IsNumber()
  Roles_ID: number;
}

export class CreateUserHasSchoolsDto {
  @ApiProperty()
  @IsNumber()
  Schools_ID: number;

  @ApiProperty()
  @IsNumber()
  Users_ID: number;
}
