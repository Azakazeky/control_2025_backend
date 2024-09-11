import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class NisConvertJson implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request... in middleware');
    console.log(req.body);
    console.log(req.ip);
    console.log(Date());

    next();
  }
}
