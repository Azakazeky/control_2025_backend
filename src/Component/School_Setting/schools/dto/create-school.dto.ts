import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
export class CreateSchoolDto {
  @ApiProperty()
  @IsNumber()
  School_Type_ID: number;

  @ApiProperty()
  @IsString()
  Name: string;
}
