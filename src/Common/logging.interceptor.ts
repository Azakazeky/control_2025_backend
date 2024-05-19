import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map, throwError, of } from "rxjs";
import { catchError } from 'rxjs/operators';
import { PrismaService } from "./Db/prisma.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    // constructor(private readonly PrismaService: PrismaService,) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /*  let request=  context.switchToHttp().getRequest();
     
      this.PrismaService.systemlogger.create({
        data: {
          UserId:+request.user.userId,
          JsonData: request.body,
          TableName:'TableName',
          Action:'Action',
          CreatedDate:new Date().toISOString(),
        }
      });
      */
      
        return next.handle().pipe(map(
            data => (         
                {
                status: true,
                // statusCode: context.switchToHttp().getResponse().statusCode,
                message: "Data has been get success",
                data: data,

            })),
            catchError(err => of({
                status: false,
                message:err.message
            }))
            );
    }
}