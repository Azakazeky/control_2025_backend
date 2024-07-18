import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateProctorDto
{
    @ApiProperty()
    @IsString()
    Full_Name: string;

    @ApiProperty()
    @IsString()
    User_Name: string;

    @ApiProperty()
    @IsString()
    Password: string;

    @ApiProperty()
    @IsNumber()
    Created_By: number;
}

export class AssignProctorToExamRoomDto
{

    @ApiProperty()
    @IsNumber()
    proctors_ID: number;

    @ApiProperty()
    @IsNumber()
    exam_room_ID: number;

    @ApiProperty()
    @IsString()
    Month: string;

    @ApiProperty()
    @IsString()
    Year: string;

    @ApiProperty()
    @IsBoolean()
    Period?: Boolean;

    @ApiProperty()
    @IsString()
    Attendance?: string;

    @ApiProperty()
    @IsNumber()
    Created_By: number;
}
