import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateManyClassDeskDto {
  @ApiProperty()
  @IsNumber()
  School_Class_ID: number;

  @ApiProperty()
  @IsNumber({}, { each: true })
  Rows: number[];
}
