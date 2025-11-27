import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { ProductCategoryResponseDto } from './dto/product-category-response.dto';
import { ProductCategoryWithRelations } from '../../types/prisma.types';
import { PrismaTypeUtils } from '../../types/prisma-utils';

@Injectable()
export class ProductCategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const { name, parentId } = createProductCategoryDto;

        // Check if parent exists
        if (parentId) {
            const parentExists = await this.prisma.productCategory.findUnique({
                where: { id: parentId },
            });
            if (!parentExists) {
                throw new BadRequestException('Parent category not found');
            }
        }

        // Check if name already exists at the same level
        const existingCategory = await this.prisma.productCategory.findFirst({
            where: {
                name,
                parentId: parentId || null,
            },
        });

        if (existingCategory) {
            throw new BadRequestException('Category name already exists at this level');
        }

        const category = await this.prisma.productCategory.create({
            data: {
                name,
                parentId,
            },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });

        return new ProductCategoryResponseDto({
            ...category,
            productCount: (category as any)._count?.products || 0,
        });
    }

    async findAll(queryDto: ProductCategoryQueryDto = {}): Promise<ProductCategoryResponseDto[]> {
        const {
            search,
            parentId,
            sortBy = 'name',
            sortOrder = 'asc',
            includeProducts = false,
            includeParent = true,
            includeChildren = true,
            rootsOnly = false,
        } = queryDto;

        // Build where clause
        const where: any = {};

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (parentId !== undefined) {
            where.parentId = parentId;
        }

        if (rootsOnly) {
            where.parentId = null;
        }

        // Build include clause
        const include: any = {
            _count: {
                select: { products: true },
            },
        };

        if (includeParent) {
            include.parent = true;
        }

        if (includeChildren) {
            include.children = true;
        }

        if (includeProducts) {
            include.products = true;
        }

        // Build orderBy clause
        let orderBy: any = {};
        if (sortBy === 'productCount') {
            // For sorting by product count, we'll do manual sorting after the query
            orderBy = { name: 'asc' }; // Default ordering for database query
        } else {
            orderBy[sortBy] = sortOrder;
        }

        const categories = await this.prisma.productCategory.findMany({
            where,
            include,
            orderBy,
        });

        let result = categories.map(category =>
            new ProductCategoryResponseDto({
                ...category,
                productCount: PrismaTypeUtils.getProductCount(category),
            })
        );

        // Manual sorting for product count if needed
        if (sortBy === 'productCount') {
            result = result.sort((a, b) => {
                const aCount = a.productCount || 0;
                const bCount = b.productCount || 0;
                return sortOrder === 'asc' ? aCount - bCount : bCount - aCount;
            });
        }

        return result;
    }

    async findRootCategories(): Promise<ProductCategoryResponseDto[]> {
        const categories = await this.prisma.productCategory.findMany({
            where: {
                parentId: null,
            },
            include: {
                children: {
                    include: {
                        children: true,
                        _count: {
                            select: { products: true },
                        },
                    },
                },
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return categories.map(category =>
            new ProductCategoryResponseDto({
                ...category,
                productCount: PrismaTypeUtils.getProductCount(category),
            })
        );
    }

    async findOne(id: string): Promise<ProductCategoryResponseDto> {
        const category = await this.prisma.productCategory.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    include: {
                        _count: {
                            select: { products: true },
                        },
                    },
                },
                _count: {
                    select: { products: true },
                },
            },
        });

        return new ProductCategoryResponseDto({
            ...category,
            productCount: PrismaTypeUtils.getProductCount(category),
        });
    }

    async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const { name, parentId } = updateProductCategoryDto;

        // Check if category exists
        const existingCategory = await this.prisma.productCategory.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new NotFoundException('Product category not found');
        }

        // Check if parent exists (if provided)
        if (parentId) {
            if (parentId === id) {
                throw new BadRequestException('Category cannot be its own parent');
            }

            const parentExists = await this.prisma.productCategory.findUnique({
                where: { id: parentId },
            });
            if (!parentExists) {
                throw new BadRequestException('Parent category not found');
            }

            // Check for circular dependency
            const isCircular = await this.checkCircularDependency(id, parentId);
            if (isCircular) {
                throw new BadRequestException('Circular dependency detected');
            }
        }

        // Check if name already exists at the same level (excluding current category)
        if (name) {
            const nameConflict = await this.prisma.productCategory.findFirst({
                where: {
                    name,
                    parentId: parentId !== undefined ? parentId : existingCategory.parentId,
                    NOT: {
                        id,
                    },
                },
            });

            if (nameConflict) {
                throw new BadRequestException('Category name already exists at this level');
            }
        }

        const category = await this.prisma.productCategory.update({
            where: { id },
            data: updateProductCategoryDto,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });

        return new ProductCategoryResponseDto({
            ...category,
            productCount: (category as any)._count?.products || 0,
        });
    }

    async remove(id: string): Promise<void> {
        // Check if category exists
        const category = await this.prisma.productCategory.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Product category not found');
        }

        // Check if category has children
        if (category.children.length > 0) {
            throw new BadRequestException('Cannot delete category with subcategories');
        }

        // Check if category has products
        if (category.products.length > 0) {
            throw new BadRequestException('Cannot delete category with products');
        }

        await this.prisma.productCategory.delete({
            where: { id },
        });
    }

  private async checkCircularDependency(categoryId: string, newParentId: string): Promise<boolean> {
    let currentParentId: string | null = newParentId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        return true; // Circular dependency detected
      }
      
      if (currentParentId === categoryId) {
        return true; // Would create circular dependency
      }

      visited.add(currentParentId);

      const parent = await this.prisma.productCategory.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });

      currentParentId = parent?.parentId || null;
    }

    return false;
  }    async getCategoryHierarchy(id: string): Promise<ProductCategoryResponseDto> {
        const category = await this.findOne(id);

        const buildHierarchy = async (cat: ProductCategoryResponseDto): Promise<ProductCategoryResponseDto> => {
            if (cat.children && cat.children.length > 0) {
                const childrenWithHierarchy = await Promise.all(
                    cat.children.map(child => this.findOne(child.id).then(buildHierarchy))
                );
                cat.children = childrenWithHierarchy;
            }
            return cat;
        };

        return await buildHierarchy(category);
    }
}