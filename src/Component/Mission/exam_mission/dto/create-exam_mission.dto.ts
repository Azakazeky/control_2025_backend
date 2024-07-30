import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsNumber, IsString } from 'class-validator';

export class CreateExamMissionDto
{
  @ApiProperty()
  @IsNumber()
  Subjects_ID: number;

  @ApiProperty()
  @IsNumber()
  Control_Mission_ID: number;

  @ApiProperty()
  @IsNumber()
  grades_ID: number;

  @ApiProperty()
  @IsNumber()
  education_year_ID: number;

  @ApiProperty()
  @IsString()
  Month: string;

  @ApiProperty()
  @IsString()
  Year: string;

  @ApiProperty()
  @IsString()
  FinalDegree: string;

  @ApiProperty()
  @IsBoolean()
  Period?: boolean;

  @ApiProperty()
  @IsBoolean()
  Create_Only?: boolean;

  @ApiProperty()
  @IsNumber()
  duration?: number | null;

  @ApiProperty()
  @IsISO8601()
  start_time?: Date | string | null;

  @ApiProperty()
  @IsISO8601()
  end_time?: Date | string | null;

  @ApiProperty()
  @IsString()
  pdf?: string | null;

  @ApiProperty()
  @IsString()
  pdf_V2?: string | null;
}
