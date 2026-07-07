import { eq, and, SQL, like, or } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { users, insertUserSchema, updateUserSchema } from "./shared/schema";
import type { User, InsertUser, UpdateUser } from "./shared/schema";

export class UserManager {
  async createUser(data: InsertUser): Promise<User> {
    const db = await getDb();
    const validated = insertUserSchema.parse(data);
    const [user] = await db.insert(users).values(validated).returning();
    return user;
  }

  /**
   * 获取用户列表
   */
  async getUsers(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<User, 'id' | 'name' | 'email' | 'isActive'>>;
    search?: string;
  } = {}): Promise<User[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    // 搜索条件
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )!
      );
    }

    // 过滤条件
    if (filters.id !== undefined) {
      conditions.push(eq(users.id, filters.id));
    }
    if (filters.name !== undefined) {
      conditions.push(eq(users.name, filters.name));
    }
    if (filters.email !== undefined) {
      conditions.push(eq(users.email, filters.email));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive));
    }

    if (conditions.length > 0) {
      return db.select().from(users).where(and(...conditions)).limit(limit).offset(skip).orderBy(users.createdAt);
    }

    return db.select().from(users).limit(limit).offset(skip).orderBy(users.createdAt);
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User | null> {
    const db = await getDb();
    const validated = updateUserSchema.parse(data);
    const [user] = await db
      .update(users)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取用户选项（用于下拉框）
   */
  async getUserOptions(): Promise<{ id: string; name: string; email: string }[]> {
    const db = await getDb();
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email
    }).from(users).orderBy(users.name);
  }
}

export const userManager = new UserManager();
