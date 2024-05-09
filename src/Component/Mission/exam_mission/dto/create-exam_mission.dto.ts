import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateExamMissionDto
{
    @ApiProperty()
    @IsNumber()
    Subjects_ID: number;

    @ApiProperty()
    @IsNumber()
    Control_Mission_ID: number;
}
