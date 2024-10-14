import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * @description
 * A Guard that will check if the user has the correct role to access the route.
 * If the user doesn't have the correct role, a ForbiddenException will be thrown.
 * If the user has the correct role, the request will be allowed to proceed.
 * @param roles The roles that are required to access the route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * @description
   * The constructor for the RolesGuard.
   * @param reflector The Reflector is used to get the roles that are required for the route.
   */
  constructor(private reflector: Reflector) {}

  /**
   * @description
   * The canActivate method is called by Nest to determine if the request should be allowed to proceed.
   * It will check if the user has the correct role to access the route.
   * If the user doesn't have the correct role, a ForbiddenException will be thrown.
   * If the user has the correct role, the request will be allowed to proceed.
   * @param context The ExecutionContext contains information about the request.
   */
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.headers.user;

    var matchRoles = this.matchRoles(roles, user.roles);
    return matchRoles;
  }

  /**
   * @description
   * The matchRoles method checks if the user has any of the roles that are required.
   * @param roles The roles that are required to access the route.
   * @param userRoles The roles that the user has.
   */
  matchRoles(roles: string[], userRoles: string[]): boolean {
    return roles.some((role) => userRoles.includes(role));
  }
}
