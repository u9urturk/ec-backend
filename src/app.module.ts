import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ProductCategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
