import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStudentSeatNumberDto {
  @ApiProperty({ required: false })
  @IsNumber()
  ID?: number;

  @ApiProperty()
  @IsNumber()
  Active?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  Class_Desk_ID?: number;

  @ApiProperty()
  @IsNumber()
  Exam_Room_ID: number;

  @ApiProperty()
  @IsNumber()
  Student_ID: number;

  @ApiProperty()
  @IsNumber()
  Control_Mission_ID: number;

  @ApiProperty()
  @IsString()
  Seat_Number: string;

  @ApiProperty()
  @IsNumber()
  Grades_ID: number;
}
