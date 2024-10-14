import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * @author Amr
 * @description This middleware is used to convert json data to JS object.
 * @returns {void}
 */
@Injectable()
export class NisConvertJson implements NestMiddleware {
  /**
   * @description This method is called when the middleware is used.
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @param {NextFunction} next - The next function to call in the middleware stack.
   * @returns {void}
   */
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request... in middleware');
    console.log(req.body);
    console.log(req.ip);
    console.log(Date());

    next();
  }
}
