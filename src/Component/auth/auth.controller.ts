import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';

@ApiBearerAuth('JWT')
@ApiTags('Users')
@Controller('auth')
export class AuthController {
  /**
   * Constructor
   * @param authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Login for users and proctor
   * @param mobile
   * @param request
   * @param ip
   * @param body
   */
  @Post('login')
  login(
    @Query('mobile') mobile: number,
    @Req() request,
    @Ip() ip: string,
    @Body() body: LoginDto,
  ) {
    // getting the useragent and ip address from @Req decorator and @Ip decorator imported at the top.
    console.log(ip);
    return this.authService.login(
      body.userName,
      body.password,
      +mobile,
      // {
      // ipAddress: ip,
      // userAgent: request.headers['user-agent'],
      // }
    );
  }

  /**
   * Get new AccessToken when user change school
   * @param req
   * @param schoolId
   */
  @Get('get-new-access-token/:schoolId')
  getNewAccessToken(@Req() req: Request, @Param('schoolId') schoolId: string) {
    return this.authService.updateUserToken(
      +req.headers['user']['userId'],
      'user',
      +schoolId,
    );
  }

  /**
   * Login for Student
   * @param body
   */
  @Post('studentLoginForExam')
  studentLoginForExam(@Body() body: LoginDto) {
    return this.authService.studentLoginForExam(body.userName, body.password);
  }

  /**
   * Get new AccessToken when refresh token is sent
   * @param body
   */
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  /**
   * Logout
   * @param body
   */
  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    console.log('logout');
    return this.authService.logout(body.refreshToken);
  }
}
