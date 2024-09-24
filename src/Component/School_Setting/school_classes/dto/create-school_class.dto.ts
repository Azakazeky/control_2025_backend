import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSchoolClassDto {
  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  Max_Capacity?: string | null;

  @ApiProperty()
  @IsNumber()
  Class_Number: number;

  @ApiProperty()
  @IsString()
  Floor?: string | null;

  @ApiProperty()
  @IsString()
  Rows?: string | null;

  @ApiProperty()
  @IsNumber()
  Columns?: number | null;
}
