import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NisConvertJson implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request... in middleware');
    console.log(req.body);
    console.log(req.ip);
    console.log(Date());

    if (req.url.endsWith('.html')) {
      throw new ForbiddenException('HTML files are not allowed.');
    }


    next();
  }
}
