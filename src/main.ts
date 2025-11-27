import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, CustomValidationPipe, LoggingInterceptor, ResponseInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Apply custom validation pipe
  app.useGlobalPipes(new CustomValidationPipe());

  // Apply global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor()
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('A comprehensive e-commerce backend API built with NestJS and Prisma')
    .setVersion('1.0')
    .addTag('Products', 'Product management endpoints')
    .addTag('Product Categories', 'Product category management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Campaigns', 'Campaign management endpoints')
    .addBearerAuth() // For future authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
