import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export default RefreshTokenDto;
