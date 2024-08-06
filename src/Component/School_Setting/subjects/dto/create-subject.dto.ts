import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  Name: string;

  Active?: number;

  InExam?: number
}
