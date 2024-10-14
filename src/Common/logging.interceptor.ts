import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Observable, catchError, map, of } from 'rxjs';
import { PrismaService } from './Db/prisma.service';

/**
 * This interceptor is used to log the requests in the `system_logger` table.
 *
 * The interceptor will not log the following requests:
 * - login requests
 * - logout requests
 * - refresh requests
 * - token requests
 * - studentLoginForExam requests
 * - GET requests
 *
 * The interceptor will log the following data:
 * - ip
 * - method (Create, Update or Delete)
 * - url
 * - platform (Windows, Mac, Linux, Android, iOS)
 * - userAgent
 * - body (the request body)
 * - userId (the user id)
 *
 * The interceptor will also catch any errors that occur during the execution of the request and return an error response with the error message.
 *
 * @author Amr
 * @returns {Observable<any>}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * The method that is called when the interceptor is used.
   * It logs the request data in the `system_logger` table.
   * It also catches any errors that occur during the execution of the request and return an error response with the error message.
   * @param {ExecutionContext} context - The execution context.
   * @param {CallHandler} next - The call handler.
   * @returns {Observable<any>}
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(async (data) => {
        if (
          !(
            req.url.includes('login') ||
            req.url.includes('logout') ||
            req.url.includes('refresh') ||
            req.url.includes('token') ||
            req.url.includes('studentLoginForExam')
          ) &&
          !req.method.includes('GET')
        ) {
          await this.prismaService.system_logger.create({
            data: {
              ip: req.ip,
              method: req.method.includes('POST')
                ? 'Create'
                : req.method.includes('PATCH') || req.method.includes('PUT')
                ? 'Update'
                : 'Delete',
              url: req.url,
              platform: req.headers['sec-ch-ua-platform'],
              userAgent: req.headers['user-agent'],
              body: JSON.stringify(req.body),
              userId: JSON.stringify(req.headers['user']['userId']),
            },
          });
        }
        return {
          status: true,
          // statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Data has been get success',
          data: data,
        };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        } else if (err instanceof PrismaClientKnownRequestError) {
          throw err;
        }
        return of({
          status: false,
          message: err.message,
        });
      }),
    );
  }
}
