import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProctorDto {
  @ApiProperty()
  @IsNumber()
  School_Id;

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
  isFloorManager: string;

  @ApiProperty()
  @IsString()
  Division: string;
}

export class AssignProctorToExamRoomDto {
  @ApiProperty()
  @IsNumber()
  proctors_ID: number;

  @ApiProperty()
  @IsNumber()
  exam_room_ID: number;

  @ApiProperty()
  @IsString()
  Month: string;

  @ApiProperty()
  @IsString()
  Year: string;

  @ApiProperty()
  @IsBoolean()
  Period?: boolean;

  @ApiProperty()
  @IsString()
  Attendance?: string;
}
