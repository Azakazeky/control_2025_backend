import { IsNumber, IsString } from 'class-validator';
import { UserType } from 'src/Component/event-handler/enums/user_type.enum';

export class DisconnectFromExamRoomDto {
  @IsNumber()
  userId: number;

  @IsString()
  userType: UserType;

  @IsNumber()
  examRoomId: number;
}
