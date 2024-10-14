import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/Component/auth/auth.service';

/**
 * Guard that checks if the request is valid by validating the jwt token in the Authorization header.
 * If the token is valid, the request is allowed to proceed.
 * Otherwise, a ForbiddenException is thrown.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructor.
   * @param authService Instance of AuthService
   */
  constructor(readonly authService: AuthService) {}

  /**
   * Check if the request is valid by validating the jwt token in the Authorization header.
   * If the token is valid, the request is allowed to proceed.
   * Otherwise, a ForbiddenException is thrown.
   * @param context ExecutionContext
   * @returns boolean | Promise<boolean> | Observable<boolean>
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.authService.validateRequest(request);
  }
}
