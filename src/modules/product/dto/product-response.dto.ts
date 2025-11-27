import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategoryResponseDto } from '../../product-category/dto/product-category-response.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest Apple smartphone with advanced features',
  })
  description?: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
  })
  stock: number;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId?: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-11-26T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-11-26T10:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Product category details',
    type: () => ProductCategoryResponseDto,
  })
  category?: ProductCategoryResponseDto;

  @ApiPropertyOptional({
    description: 'Stock status',
    example: 'in_stock',
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
  })
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';

  constructor(partial: Partial<ProductResponseDto> | any) {
    Object.assign(this, partial);

    // Convert Decimal to number
    if (this.price && typeof this.price !== 'number') {
      this.price = Number(this.price);
    }

    // Handle null to undefined conversion for optional fields
    if (this.description === null) {
      this.description = undefined;
    }
    if (this.categoryId === null) {
      this.categoryId = undefined;
    }

    // Determine stock status
    if (this.stock !== undefined) {
      if (this.stock === 0) {
        this.stockStatus = 'out_of_stock';
      } else if (this.stock <= 10) {
        this.stockStatus = 'low_stock';
      } else {
        this.stockStatus = 'in_stock';
      }
    }
  }
}