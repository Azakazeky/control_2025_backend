import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  Name: string;

  Active?: number;
  
  @ApiProperty()
  @IsNumber()
  InExam?: number;


}

export class CreateSubjectDto2 {
  @ApiProperty()
  @IsString()
  Name: string;

  Active?: number;
  
  @ApiProperty()
  @IsNumber()
  InExam?: number;

  @ApiProperty()
  @IsArray()
  school_type_has_subjects?: Array<number>;

}
