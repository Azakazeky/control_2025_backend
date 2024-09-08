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

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let req = context.switchToHttp().getRequest();
    let res = context.switchToHttp().getResponse();
  
    if (req.method != 'GET' || !req.url.includes('/auth/login')) {
      await this.PrismaService.system_logger.create({
        data: {
          Action: req.method,
          UserId: req.headers['user'] == undefined ? "LOGIN" : '' + req.headers['user']['userId'] ?? 'no id',
          TableName: req.url,
          Record_Befor: req.body == undefined ? null : req.body.toString(),
          Record_After: res.data,
        }
      });
    }
    return next.handle().pipe(

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
