import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, ValidateNested } from "class-validator";

export class CreateStudentSeatNumberDto
{
    @ApiProperty()
    @IsNumber()
    @ValidateNested( { each: true } )
    Student_IDs: number[];

    @ApiProperty()
    @IsNumber()
    controlMissionId: number;

}