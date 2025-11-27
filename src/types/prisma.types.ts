import { Prisma } from '@prisma/client';

// Product Category with relations - flexible include pattern
export type ProductCategoryWithCount = Prisma.ProductCategoryGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

export type ProductCategoryWithRelations = Prisma.ProductCategoryGetPayload<{
  include: {
    parent?: boolean;
    children?: boolean | {
      include: {
        _count: {
          select: {
            products: true;
          };
        };
      };
    };
    products?: boolean | {
      select: {
        id: true;
        name: true;
        price: true;
        stock: true;
      };
    };
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

// Product with relations
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category?: true;
    orderItems?: true;
    campaignProducts?: true;
  };
}>;

// User with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    profile?: true;
    addresses?: true;
    orders?: true;
  };
}>;

// Order with relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user?: true;
    address?: true;
    items?: {
      include: {
        product?: true;
      };
    };
  };
}>;

// Common query options
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SortOptions<T = string> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}