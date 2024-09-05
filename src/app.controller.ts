import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getServerTime() {
    return this.addhours(3);
  }

  addhours(h: number) {
    let now = new Date();
    now.setHours(now.getHours() + h);
    return now;
  }
}
