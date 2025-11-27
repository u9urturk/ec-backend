import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}