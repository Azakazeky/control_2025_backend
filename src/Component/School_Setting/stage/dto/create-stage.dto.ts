import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateStageDto
{
    @ApiProperty()
    @IsString()
    Name: string;

    @ApiProperty()
    @IsNumber()
    Created_By: number;
}
