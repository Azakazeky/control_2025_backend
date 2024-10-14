import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * This is a custom guard that is used to validate the JWT token in the Authorization header
 * of the request. If the token is invalid, it will throw an UnauthorizedException.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * This method is called when the guard is used to validate the request.
   * @param err - The error that occurred while validating the request.
   * @param user - The user that was found in the database.
   * @param info - The information about the token that was passed in the request.
   * @param context - The execution context of the request.
   * @param status - The status of the request.
   * @returns - The result of the validation.
   */
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      // if the access token jwt is invalid this is the error we will be returning.
      throw new UnauthorizedException('Invalid JWT');
    }
    // we are adding the user to the request so that we can access it in the controller
    var request = context.switchToHttp().getRequest();
    request.user = user;
    console.log(request.user);

    // we are calling the parent class's handleRequest method to finish the validation
    return super.handleRequest(err, user, info, context, status);
  }
}
