import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUuidDto {
  @ApiProperty()
  @IsString()
  UUID: string;

  @ApiProperty()
  @IsNumber()
  ExamMissionId: number;
}
