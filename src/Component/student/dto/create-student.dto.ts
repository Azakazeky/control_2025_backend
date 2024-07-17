import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateStudentDto
{

    @ApiProperty( { required: false } )
    @IsNumber()
    ID?: number;

    @ApiProperty()
    @IsNumber()
    Grades_ID: number;

    @ApiProperty()
    @IsNumber()
    Blb_Id: number;

    @ApiProperty()
    @IsNumber()
    Schools_ID: number;

    @ApiProperty()
    @IsNumber()
    Cohort_ID: number;

    @ApiProperty()
    @IsNumber()
    School_Class_ID: number;

    @ApiProperty()
    @IsString()
    First_Name: string;

    @ApiProperty()
    @IsString()
    Second_Name: string;

    @ApiProperty()
    @IsString()
    Third_Name: string;

    @ApiProperty()
    @IsString()
    Second_Lang: string;


    @ApiProperty()
    @IsString()
    Religion: string;

    @ApiProperty()
    @IsString()
    Created_By: number;

}
