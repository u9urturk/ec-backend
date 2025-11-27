import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  async getDbStatus() {
    return this.appService.getDbStatus();
  }

  @Get('users/count')
  async getUserCount() {
    const count = await this.appService.getUserCount();
    return { userCount: count };
  }
}
