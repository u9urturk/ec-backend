import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { ProductWithRelations, PaginatedResponse } from '../../types/prisma.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        const { name, description, price, stock, categoryId } = createProductDto;

        // Check if category exists
        if (categoryId) {
            const categoryExists = await this.prisma.productCategory.findUnique({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                throw new BadRequestException('Category not found');
            }
        }

        // Check if product name already exists
        const existingProduct = await this.prisma.product.findFirst({
            where: { name },
        });

        if (existingProduct) {
            throw new BadRequestException('Product with this name already exists');
        }

        const product = await this.prisma.product.create({
            data: {
                name,
                description,
                price: new Prisma.Decimal(price),
                stock,
                categoryId,
            },
            include: {
                category: true,
            },
        });

        return new ProductResponseDto(product);
    }

    async findAll(queryDto: ProductQueryDto): Promise<PaginatedProductResponseDto> {
        const {
            search,
            categoryId,
            minPrice,
            maxPrice,
            stockStatus,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 20,
            includeCategory = false,
        } = queryDto;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = new Prisma.Decimal(minPrice);
            }
            if (maxPrice !== undefined) {
                where.price.lte = new Prisma.Decimal(maxPrice);
            }
        }

        if (stockStatus) {
            switch (stockStatus) {
                case 'out_of_stock':
                    where.stock = 0;
                    break;
                case 'low_stock':
                    where.stock = { gt: 0, lte: 10 };
                    break;
                case 'in_stock':
                    where.stock = { gt: 10 };
                    break;
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build orderBy
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        // Get total count
        const total = await this.prisma.product.count({ where });

        // Get products
        const products = await this.prisma.product.findMany({
            where,
            include: includeCategory ? { category: true } : undefined,
            orderBy,
            skip,
            take: limit,
        });

        const productDtos = products.map(product => new ProductResponseDto(product));

        return new PaginatedProductResponseDto(productDtos, page, limit, total);
    }

    async findOne(id: string, includeCategory = true): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: includeCategory ? { category: true } : undefined,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return new ProductResponseDto(product);
    }

    async findByCategory(categoryId: string, queryDto: Partial<ProductQueryDto> = {}): Promise<PaginatedProductResponseDto> {
        // Check if category exists
        const categoryExists = await this.prisma.productCategory.findUnique({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            throw new NotFoundException('Category not found');
        }

        return this.findAll({ ...queryDto, categoryId });
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const { name, description, price, stock, categoryId } = updateProductDto;

        // Check if product exists
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        // Check if category exists (if provided)
        if (categoryId) {
            const categoryExists = await this.prisma.productCategory.findUnique({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                throw new BadRequestException('Category not found');
            }
        }

        // Check if product name already exists (excluding current product)
        if (name && name !== existingProduct.name) {
            const nameConflict = await this.prisma.product.findFirst({
                where: {
                    name,
                    NOT: { id },
                },
            });

            if (nameConflict) {
                throw new BadRequestException('Product with this name already exists');
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = new Prisma.Decimal(price);
        if (stock !== undefined) updateData.stock = stock;
        if (categoryId !== undefined) updateData.categoryId = categoryId;

        const product = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            },
        });

        return new ProductResponseDto(product);
    }

    async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock + quantity < 0) {
            throw new BadRequestException('Insufficient stock');
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                stock: product.stock + quantity,
            },
            include: {
                category: true,
            },
        });

        return new ProductResponseDto(updatedProduct);
    }

    async remove(id: string): Promise<void> {
        // Check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                orderItems: true,
                campaignProducts: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if product is used in orders
        if (product.orderItems.length > 0) {
            throw new BadRequestException('Cannot delete product that has been ordered');
        }

        // Check if product is used in campaigns
        if (product.campaignProducts.length > 0) {
            throw new BadRequestException('Cannot delete product that is part of campaigns');
        }

        await this.prisma.product.delete({
            where: { id },
        });
    }

    async getLowStockProducts(threshold = 10): Promise<ProductResponseDto[]> {
        const products = await this.prisma.product.findMany({
            where: {
                stock: {
                    lte: threshold,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                stock: 'asc',
            },
        });

        return products.map(product => new ProductResponseDto(product));
    }

    async getProductStats(): Promise<{
        total: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
        byCategory: { categoryName: string; count: number }[];
    }> {
        const [
            total,
            inStock,
            lowStock,
            outOfStock,
            byCategory,
        ] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { stock: { gt: 10 } } }),
            this.prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
            this.prisma.product.count({ where: { stock: 0 } }),
            this.prisma.productCategory.findMany({
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            }),
        ]);

        const categoryStats = byCategory.map(category => ({
            categoryName: category.name,
            count: category._count.products,
        }));

        return {
            total,
            inStock,
            lowStock,
            outOfStock,
            byCategory: categoryStats,
        };
    }
}