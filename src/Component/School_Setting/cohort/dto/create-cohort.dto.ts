import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCohortDto
{
  @ApiProperty()
  @IsNumber()
  School_Type_ID: number;

  @ApiProperty()
  @IsString()
  Name: string;
}

export class AddSubjectsToCohort
{
  @ApiProperty()
  @IsNumber()
  Subjects_ID: number;
}
