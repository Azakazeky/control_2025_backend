import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from './Db/prisma.service';

/**
 * This interceptor is used to check if the user is active or not.
 * It works by checking the `Active` field in the `users`, `proctors` and `students` tables.
 * If the user is not active, it will throw a `HttpException` with a status code of 400 and a message that the account has been deactivated.
 * @author Amr
 * @returns {Observable<any>}
 */
@Injectable()
export class ActiveUserInterceptor implements NestInterceptor {
  /**
   * The constructor that injects the `PrismaService`.
   * @param {PrismaService} prismaService - The prisma service.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * The method that is called when the interceptor is used.
   * It checks if the user is active or not and throws an exception if the user is not active.
   * @param {ExecutionContext} context - The execution context.
   * @param {CallHandler} next - The call handler.
   * @returns {Observable<any>}
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let req = context.switchToHttp().getRequest();

    let userId, userType;
    if (req.headers['user'] && req.headers['user']['userId']) {
      userId = req.headers['user']['userId'];
      userType = req.headers['user']['type'];
    }
    if (userId) {
      if (userType === 'student') {
        const user = await this.prismaService.student.findUnique({
          where: {
            ID: userId,
          },
          select: {
            Active: true,
          },
        });
        if (user?.Active) {
          return next.handle();
        } else if (user?.Active === 0) {
          throw new HttpException(
            'Your account has been deactivated.\nPlease contact your administrator',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else if (userType === 'user') {
        const user = await this.prismaService.users.findUnique({
          where: {
            ID: userId,
          },
          select: {
            Active: true,
          },
        });
        if (user?.Active) {
          return next.handle();
        } else if (user?.Active === 0) {
          throw new HttpException(
            'Your account has been deactivated.\nPlease contact your administrator',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else if (userType) {
        const user = await this.prismaService.proctors.findUnique({
          where: {
            ID: userId,
          },
          select: {
            Active: true,
          },
        });
        if (user?.Active) {
          return next.handle();
        } else if (!user?.Active) {
          throw new HttpException(
            'Your account has been deactivated.\nPlease contact your administrator',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return next.handle();
  }
}
