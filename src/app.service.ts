import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  addHours() {
    let now = new Date();
    now.setHours(now.getHours() + 3);
    return now.toISOString();
  }
}
