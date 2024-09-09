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
  constructor(private readonly PrismaService: PrismaService,) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req = context.switchToHttp().getRequest();

    next.handle().forEach(async (value) => {
      console.log(value);

      console.log(req.body);

      await this.PrismaService.system_logger.create({
        data: {
          Action: req.method,
          UserId: req.headers['user'] == undefined ? "LOGIN" : '' + req.headers['user']['userId'] ?? 'no id',
          TableName: req.url,
          Record_Befor: req.body == undefined ? null : req.body.toString(),
          Record_After: value.toString(),
        }
      });

    });


    return next.handle()
      .pipe(
        map((data) => ({
          status: true,
          // statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Data has been get success',
          data: data,
        })),
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
