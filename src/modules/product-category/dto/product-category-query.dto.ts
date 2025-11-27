import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsIn, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ProductCategoryQueryDto {
  @ApiPropertyOptional({
    description: 'Search by category name',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by category level (depth in hierarchy)',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  level?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'name',
    enum: ['name', 'createdAt', 'productCount'],
  })
  @IsOptional()
  @IsIn(['name', 'createdAt', 'productCount'])
  sortBy?: 'name' | 'createdAt' | 'productCount';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Include products in response',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProducts?: boolean;

  @ApiPropertyOptional({
    description: 'Include parent details in response',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeParent?: boolean;

  @ApiPropertyOptional({
    description: 'Include children details in response',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeChildren?: boolean;

  @ApiPropertyOptional({
    description: 'Only return root categories (no parent)',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  rootsOnly?: boolean;
}