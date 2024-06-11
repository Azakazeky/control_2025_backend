import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateControlMissionDto
{
    @ApiProperty()
    @IsNumber()
    Education_year_ID: number;

    @ApiProperty()
    @IsString()
    Schools_ID: number;

    @ApiProperty()
    @IsString()
    Name: string;

    @ApiProperty()
    @IsString()
    Mission_Name: string;

    @ApiProperty()
    @IsDate()
    Start_Date;

    @ApiProperty()
    @IsDate()
    End_Date;
}
