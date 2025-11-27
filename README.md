# E-Commerce Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

E-Commerce Backend API built with [NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Features

- **Product Management**: Complete CRUD operations for products
- **Category Management**: Hierarchical product categories
- **User Authentication**: JWT-based authentication system
- **Order Management**: Order processing and tracking
- **Database Integration**: Prisma ORM with PostgreSQL
- **API Documentation**: Swagger/OpenAPI integration
- **Error Handling**: Global exception filters
- **Validation**: Request validation with custom pipes
- **Logging**: Comprehensive request/response logging

## Project setup

```bash
$ npm install
```

## Database setup

```bash
# Generate Prisma client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate deploy

# Seed database (optional)
$ npx prisma db seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

Once the application is running, you can access:
- API Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Docker Support

```bash
# Build and run with Docker Compose
$ docker-compose up -d

# Stop services
$ docker-compose down
```

## License

This project is [MIT licensed](LICENSE).
