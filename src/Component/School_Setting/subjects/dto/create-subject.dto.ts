import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { IsArray, IsNumber, IsString } from 'class-validator';
=======
import { IsArray, IsString } from 'class-validator';
>>>>>>> ccf06d266ecd85c54ff7a7e735e86f5e8cd76807

export class CreateSubjectDto
{
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

<<<<<<< HEAD
=======
  InExam?: number;

  @ApiProperty( { type: Number, isArray: true } )
  @IsArray( { each: true } )
  schools_type_ID: number[];
>>>>>>> ccf06d266ecd85c54ff7a7e735e86f5e8cd76807
}
