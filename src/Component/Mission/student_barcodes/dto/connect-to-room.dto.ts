import { IsNumber, IsString } from 'class-validator';

export class ConnectToExamRoomDto {
  @IsNumber()
  userId: number;

  @IsString()
  userType: string;

  @IsNumber()
  examRoomId: number;
}
