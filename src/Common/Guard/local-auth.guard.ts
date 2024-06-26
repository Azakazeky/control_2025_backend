import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      // if the access token jwt is invalid this is the error we will be returning.
      throw new UnauthorizedException('Invalid JWT');
    }
    var request = context.switchToHttp().getRequest();
    request.user = user;
    console.log(request.user);

    return super.handleRequest(err, user, info, context, status);
  }
}