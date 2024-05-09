import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateStudentBarcodeDto
{
    @ApiProperty()
    @IsNumber()
    Exam_Mission_ID: number;

    @ApiProperty()
    @IsNumber()
    Student_ID: number;

    @ApiProperty()
    @IsString()
    Barcode: string;
}
