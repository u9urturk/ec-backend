import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';

export class ProductCategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentId?: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-11-26T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Parent category details',
    type: () => ProductCategoryResponseDto,
  })
  parent?: ProductCategoryResponseDto;

  @ApiPropertyOptional({
    description: 'Child categories',
    type: [ProductCategoryResponseDto],
  })
  children?: ProductCategoryResponseDto[];

  @ApiPropertyOptional({
    description: 'Number of products in this category',
    example: 25,
  })
  productCount?: number;

  constructor(partial: Partial<ProductCategoryResponseDto> | any) {
    Object.assign(this, partial);

    // Handle null to undefined conversion for optional fields
    if (this.parentId === null) {
      this.parentId = undefined;
    }

    // Transform parent if it exists
    if (this.parent && !(this.parent instanceof ProductCategoryResponseDto)) {
      this.parent = new ProductCategoryResponseDto(this.parent);
    }

    // Transform children if they exist
    if (this.children && Array.isArray(this.children)) {
      this.children = this.children.map(child => 
        child instanceof ProductCategoryResponseDto 
          ? child 
          : new ProductCategoryResponseDto(child)
      );
    }
  }
}