import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Electronics',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}