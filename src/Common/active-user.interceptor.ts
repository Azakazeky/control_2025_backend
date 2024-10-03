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

@Injectable()
export class ActiveUserInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let req = context.switchToHttp().getRequest();

    let userId;
    if (req.headers['user'] && req.headers['user']['userId']) {
      userId = req.headers['user']['userId'];
    }
    if (userId) {
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
    }
    return next.handle();
  }
}
