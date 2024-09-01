import { Body, Controller, Delete, Get, Ip, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';

@ApiBearerAuth( 'JWT' )
@ApiTags( 'Users' )
@Controller( 'auth' )
export class AuthController
{
  constructor ( private readonly authService: AuthService ) { }

  @Post( 'login' )
  login (
    @Query( 'mobile' ) mobile: number,
    @Req() request,
    @Ip() ip: string,
    @Body() body: LoginDto,
  )
  {
    // geting the useragent and ip address from @Req decorator and @Ip decorater imported at the top.
    console.log( ip );
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

  @Get( 'get-new-access-token/:schoolId' )
  getNewAccessToken ( @Req() req: Request, @Param( 'schoolId' ) schoolId: string )
  {
    console.log( 'getNewAccessToken', req.headers[ 'user' ][ 'userId' ], schoolId );
    return this.authService.updateUserToken( +req.headers[ 'user' ][ 'userId' ], 'user', +schoolId );
  }

  @Post( 'studentLoginForExam' )
  studentLoginForExam ( @Body() body: LoginDto )
  {
    return this.authService.studentLoginForExam( body.userName, body.password );
  }

  @Post( 'refresh' )
  async refreshToken ( @Body() body: RefreshTokenDto )
  {
    return this.authService.refresh( body.refreshToken );
  }

  @Delete( 'logout' )
  async logout ( @Body() body: RefreshTokenDto )
  {
    console.log( 'logout' );
    return this.authService.logout( body.refreshToken );
  }
}
