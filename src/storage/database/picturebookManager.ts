import { eq, and, SQL, desc, like, sql } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { picturebooks, insertPicturebookSchema, updatePicturebookSchema } from "./shared/schema";
import type { Picturebook, InsertPicturebook, UpdatePicturebook } from "./shared/schema";

export class PicturebookManager {
  async createPicturebook(data: InsertPicturebook): Promise<Picturebook> {
    const db = await getDb();
    const validated = insertPicturebookSchema.parse(data);
    const [picturebook] = await db.insert(picturebooks).values(validated).returning();
    return picturebook;
  }

  /**
   * 获取绘本列表
   */
  async getPicturebooks(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<Picturebook, 'id' | 'userId' | 'ageGroup' | 'style' | 'isPublished'>>;
    search?: string;
  } = {}): Promise<Picturebook[]> {
    const { skip = 0, limit = 20, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    // 搜索条件
    if (search) {
      conditions.push(
        like(picturebooks.title, `%${search}%`)
      );
    }

    // 过滤条件
    if (filters.id !== undefined) {
      conditions.push(eq(picturebooks.id, filters.id));
    }
    if (filters.userId !== undefined) {
      conditions.push(eq(picturebooks.userId, filters.userId));
    }
    if (filters.ageGroup !== undefined) {
      conditions.push(eq(picturebooks.ageGroup, filters.ageGroup));
    }
    if (filters.style !== undefined) {
      conditions.push(eq(picturebooks.style, filters.style));
    }
    if (filters.isPublished !== undefined) {
      conditions.push(eq(picturebooks.isPublished, filters.isPublished));
    }

    if (conditions.length > 0) {
      return db.select().from(picturebooks)
        .where(and(...conditions))
        .limit(limit)
        .offset(skip)
        .orderBy(desc(picturebooks.createdAt));
    }

    return db.select().from(picturebooks)
      .limit(limit)
      .offset(skip)
      .orderBy(desc(picturebooks.createdAt));
  }

  async getPicturebookById(id: string): Promise<Picturebook | null> {
    const db = await getDb();
    const [picturebook] = await db.select().from(picturebooks).where(eq(picturebooks.id, id));
    return picturebook || null;
  }

  async getUserPicturebooks(userId: string): Promise<Picturebook[]> {
    const db = await getDb();
    return db.select().from(picturebooks)
      .where(eq(picturebooks.userId, userId))
      .orderBy(desc(picturebooks.createdAt));
  }

  async getPublishedPicturebooks(limit: number = 20): Promise<Picturebook[]> {
    const db = await getDb();
    return db.select().from(picturebooks)
      .where(eq(picturebooks.isPublished, true))
      .orderBy(desc(picturebooks.viewCount), desc(picturebooks.createdAt))
      .limit(limit);
  }

  async updatePicturebook(id: string, data: UpdatePicturebook): Promise<Picturebook | null> {
    const db = await getDb();
    const validated = updatePicturebookSchema.parse(data);
    const [picturebook] = await db
      .update(picturebooks)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(picturebooks.id, id))
      .returning();
    return picturebook || null;
  }

  async deletePicturebook(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(picturebooks).where(eq(picturebooks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementViewCount(id: string): Promise<void> {
    const db = await getDb();
    await db.update(picturebooks)
      .set({ viewCount: sql`${picturebooks.viewCount} + 1` })
      .where(eq(picturebooks.id, id));
  }

  /**
   * 获取绘本选项（用于下拉框）
   */
  async getPicturebookOptions(): Promise<{ id: string; title: string }[]> {
    const db = await getDb();
    return db.select({
      id: picturebooks.id,
      title: picturebooks.title
    }).from(picturebooks).orderBy(picturebooks.createdAt);
  }
}

export const picturebookManager = new PicturebookManager();
