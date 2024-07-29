import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty()
  @IsString()
  Name: string;
}
