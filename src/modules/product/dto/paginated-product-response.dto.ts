import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPrevious: boolean;
}

export class PaginatedProductResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  meta: PaginationMeta;

  constructor(
    data: ProductResponseDto[],
    page: number,
    limit: number,
    total: number,
  ) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };
  }
}