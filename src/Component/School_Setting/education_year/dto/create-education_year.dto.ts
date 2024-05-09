import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateEducationYearDto
{
    @ApiProperty()
    @IsString()
    Name: string;
}
