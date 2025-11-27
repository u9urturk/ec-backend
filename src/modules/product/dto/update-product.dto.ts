import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { 
  IsString, 
  IsOptional, 
  IsUUID, 
  MaxLength, 
  IsNumber, 
  IsPositive, 
  Min, 
  IsInt 
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'iPhone 15 Pro',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest Apple smartphone with advanced features',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 999.99,
    minimum: 0.01,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}