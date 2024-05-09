import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

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
}
