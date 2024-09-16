import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsNumber()
  Schools_ID: number;
}
