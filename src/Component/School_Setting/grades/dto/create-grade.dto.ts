import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateGradeDto {
    

    @ApiProperty()
    @IsNumber()
    Schools_ID: number
    
    @ApiProperty()
    @IsString()
    Name: string
}
