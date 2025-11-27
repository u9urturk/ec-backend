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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get products with filtering, sorting and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  async findAll(@Query() queryDto: ProductQueryDto): Promise<PaginatedProductResponseDto> {
    return this.productService.findAll(queryDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics' })
  @ApiResponse({
    status: 200,
    description: 'Product statistics retrieved successfully',
  })
  async getProductStats() {
    return this.productService.getProductStats();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: Number,
    description: 'Stock threshold (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Low stock products retrieved successfully',
    type: [ProductResponseDto],
  })
  async getLowStockProducts(
    @Query('threshold', new ParseIntPipe({ optional: true })) threshold = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getLowStockProducts(threshold);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query() queryDto: ProductQueryDto,
  ): Promise<PaginatedProductResponseDto> {
    return this.productService.findByCategory(categoryId, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'includeCategory',
    required: false,
    type: Boolean,
    description: 'Include category details in response',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeCategory') includeCategory = true,
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(id, includeCategory);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product stock updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<ProductResponseDto> {
    return this.productService.updateStock(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete product with orders or campaigns' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.remove(id);
  }
}