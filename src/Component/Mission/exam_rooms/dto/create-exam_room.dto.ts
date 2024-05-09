import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExamRoomDto
{
    @ApiProperty()
    @IsNumber()
    Control_Mission_ID: number;

    @ApiProperty()
    @IsNumber()
    School_Class_ID: number;

    @ApiProperty()
    @IsString()
    Name: string;

    @ApiProperty()
    @IsString()
    Stage: string;

    @ApiProperty()
    @IsNumber()
    Capacity: number;
}
