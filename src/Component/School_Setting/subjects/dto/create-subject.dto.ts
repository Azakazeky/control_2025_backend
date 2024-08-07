import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto
{
  @ApiProperty()
  @IsString()
  Name: string;

  Active?: number;

  @ApiProperty()
  @IsNumber()
  InExam?: number;


  @ApiProperty( { type: Number, isArray: true } )
  @IsArray( { each: true } )
  schools_type_ID: number[];
}
