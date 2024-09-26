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

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(async (data) => {
        if (
          !(
            req.url.includes('login') ||
            req.url.includes('logout') ||
            req.url.includes('refresh') ||
            req.url.includes('token')
          ) &&
          !req.method.includes('GET')
        ) {
          console.log({
            host: req.headers.host,
            method: req.method.includes('POST')
              ? 'Create'
              : req.method.includes('PATCH') || req.method.includes('PUT')
              ? 'Update'
              : 'Delete',
            url: req.url,
            platform: req.headers['sec-ch-ua-platform'],
            userAgent: req.headers['user-agent'],
            body: JSON.stringify(req.body),
            userId: req.headers['user']['userId'],
          });

          // this.PrismaService.system_logger.create({
          //   data: {
          //     Action: req.method,
          //     UserId:
          //       req.headers['user'] == undefined
          //         ? 'LOGIN'
          //         : '' + req.headers['user']['userId'] ?? 'no id':
          //     TableName: req.url,
          //     Record_Befor: JSON.stringify(req.body),
          //     Record_After: JSON.stringify(data),
          //   },
          // });
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
