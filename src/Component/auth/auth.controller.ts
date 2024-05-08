import { Body, Controller, Delete, Ip, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth('JWT')
@ApiTags("Users")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Query('mobile') mobile: number,   @Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    // geting the useragent and ip address from @Req decorator and @Ip decorater imported at the top.
    console.log(ip);
    return this.authService.login(body.userName, body.password, +mobile
      // {
      // ipAddress: ip,
      // userAgent: request.headers['user-agent'],
      // }

    );
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    console.log('logout');   
    return this.authService.logout(body.refreshToken);
  }

}

