import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";

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
    @IsDateString()
    Start_Date;

    @ApiProperty()
    @IsDateString()
    End_Date;
}
