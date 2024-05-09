import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateClassDeskDto
{
    @ApiProperty()
    @IsNumber()
    School_Class_ID: number;

    @ApiProperty()
    @IsNumber()
    Cloumn_Num: number;

    @ApiProperty()
    @IsNumber()
    Row_Num: number;
}
