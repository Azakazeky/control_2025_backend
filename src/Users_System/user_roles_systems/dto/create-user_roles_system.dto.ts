import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserRolesSystemDto {
  @ApiProperty()
  @IsString()
  Name: string;
}

export class CreateScreenDto {
  @ApiProperty()
  @IsString()
  Name: string;
  @ApiProperty()
  @IsString()
  Front_Id: string;
}

export class ConnectRolesToScreens {
  @ApiProperty()
  @IsNumber()
  Roles_ID: number;
  @ApiProperty()
  @IsNumber()
  Screens_ID: number;
}
