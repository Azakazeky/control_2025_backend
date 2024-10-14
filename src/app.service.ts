import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Adds 3 hours to the current time and returns it as a UTC ISO string
   * @returns ISO string of the current time plus 3 hours
   */
  addHours() {
    let now = new Date();
    now.setHours(now.getHours() + 3);
    return now.toISOString();
  }
}
