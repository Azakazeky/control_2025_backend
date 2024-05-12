import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSchoolTypeDto {

    @ApiProperty()
    @IsString()
    Name: string
    
    Created_By: number

}
