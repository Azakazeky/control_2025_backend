import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

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
