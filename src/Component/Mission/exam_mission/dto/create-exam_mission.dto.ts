import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateExamMissionDto
{

    @ApiProperty()
    @IsNumber()
    Created_By: number;

    @ApiProperty()
    @IsNumber()
    Subjects_ID: number;

    @ApiProperty()
    @IsNumber()
    Control_Mission_ID: number;

    @ApiProperty()
    @IsNumber()
    grades_ID: number;

    @ApiProperty()
    @IsNumber()
    education_year_ID: number;

    @ApiProperty()
    @IsString()
    Month: string;

    @ApiProperty()
    @IsString()
    Year: string;

    @ApiProperty()
    @IsString()
    FinalDegree: string;

    @ApiProperty()
    @IsBoolean()
    Period?: Boolean;

    @ApiProperty()
    @IsNumber()
    duration?: number | null;

    @ApiProperty()
    @IsString()
    start_time?: Date | string | null;

    @ApiProperty()
    @IsString()
    end_time?: Date | string | null;

    @ApiProperty()
    @IsString()
    pdf?: string | null;

    @ApiProperty()
    @IsString()
    pdf_V2?: string | null;

}
