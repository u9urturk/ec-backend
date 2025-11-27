import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryResponseDto } from './dto/product-category-response.dto';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: ProductCategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product categories with filtering and sorting' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [ProductCategoryResponseDto],
  })
  async findAll(@Query() queryDto: ProductCategoryQueryDto): Promise<ProductCategoryResponseDto[]> {
    return this.productCategoryService.findAll(queryDto);
  }

  @Get('roots')
  @ApiOperation({ summary: 'Get root categories with their hierarchy' })
  @ApiResponse({
    status: 200,
    description: 'Root categories retrieved successfully',
    type: [ProductCategoryResponseDto],
  })
  async findRootCategories(): Promise<ProductCategoryResponseDto[]> {
    return this.productCategoryService.findRootCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: ProductCategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductCategoryResponseDto> {
    return this.productCategoryService.findOne(id);
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get complete category hierarchy starting from specified category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category hierarchy retrieved successfully',
    type: ProductCategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryHierarchy(@Param('id', ParseUUIDPipe) id: string): Promise<ProductCategoryResponseDto> {
    return this.productCategoryService.getCategoryHierarchy(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: ProductCategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete category with subcategories or products' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productCategoryService.remove(id);
  }
}