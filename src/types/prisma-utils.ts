/**
 * Utility service for handling Prisma types and responses
 */
export class PrismaTypeUtils {
  /**
   * Safely extract product count from Prisma _count field
   */
  static getProductCount(entity: any): number {
    return entity?._count?.products || 0;
  }

  /**
   * Safely extract any count from Prisma _count field
   */
  static getCount(entity: any, field: string): number {
    return entity?._count?.[field] || 0;
  }

  /**
   * Check if entity has a specific relation loaded
   */
  static hasRelation(entity: any, relation: string): boolean {
    return entity && entity[relation] !== undefined;
  }

  /**
   * Safely map Prisma entities with optional properties
   */
  static mapWithSafeCount<T extends Record<string, any>>(
    entities: T[],
    countField: string = 'products'
  ): (T & { [key: string]: number })[] {
    return entities.map(entity => ({
      ...entity,
      [`${countField}Count`]: this.getCount(entity, countField)
    }));
  }
}