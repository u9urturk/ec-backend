import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClient;
  private pool: Pool;

  constructor() {
    // Create PostgreSQL connection pool
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create Prisma adapter
    const adapter = new PrismaPg(this.pool);

    // Initialize Prisma client with adapter
    this.client = new PrismaClient({ 
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.client.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.$disconnect();
      await this.pool.end();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error('Error closing database connection:', error);
    }
  }

  // Delegate all Prisma methods
  get user() {
    return this.client.user;
  }

  get userProfile() {
    return this.client.userProfile;
  }

  get address() {
    return this.client.address;
  }

  get productCategory() {
    return this.client.productCategory;
  }

  get product() {
    return this.client.product;
  }

  get order() {
    return this.client.order;
  }

  get orderItem() {
    return this.client.orderItem;
  }

  get campaign() {
    return this.client.campaign;
  }

  get campaignProduct() {
    return this.client.campaignProduct;
  }

  get campaignCategory() {
    return this.client.campaignCategory;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }

  get $queryRaw() {
    return this.client.$queryRaw.bind(this.client);
  }

  get $executeRaw() {
    return this.client.$executeRaw.bind(this.client);
  }

  // Helper method for transaction handling
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return await this.client.$transaction(fn);
  }
}