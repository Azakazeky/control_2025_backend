import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateSchoolClassDto {

    @ApiProperty()
    @IsString()
    Name: string

    @ApiProperty()
    @IsString()
    Max_Capacity?: string | null

    @ApiProperty()
    @IsString()
    Floor?: string | null

    @ApiProperty()
    @IsString()
    Rows?: string | null

    @ApiProperty()
    @IsNumber()
    Columns?: number | null

    @ApiProperty()
    @IsNumber()
    Schools_ID: number
    
    Created_By: number

}
