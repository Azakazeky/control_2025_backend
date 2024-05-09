import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateStudentSeatNumberDto
{
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
}
