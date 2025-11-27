import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsUUID, 
  IsNotEmpty, 
  MaxLength, 
  IsNumber, 
  IsPositive, 
  Min, 
  IsInt 
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest Apple smartphone with advanced features',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    minimum: 0.01,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}