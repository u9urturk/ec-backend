import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Test database connection
  async getDbStatus() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'connected', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'disconnected', message: 'Database connection failed', error: error.message };
    }
  }

  // Get user count (test query)
  async getUserCount() {
    return await this.prisma.user.count();
  }
}
