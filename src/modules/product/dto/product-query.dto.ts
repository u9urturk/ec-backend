import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt, Min, IsIn, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Search by product name',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Minimum price',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter by stock status',
    example: 'in_stock',
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
  })
  @IsOptional()
  @IsIn(['in_stock', 'low_stock', 'out_of_stock'])
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'name',
    enum: ['name', 'price', 'stock', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsIn(['name', 'price', 'stock', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Include category details in response',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeCategory?: boolean;
}