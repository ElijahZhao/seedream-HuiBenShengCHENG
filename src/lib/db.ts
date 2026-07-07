import initSqlJs from 'sql.js';

// 使用 sql.js 实现本地 SQLite 数据库
// 所有数据存储在内存中，关闭 App 后需要持久化到 localStorage

let db: any = null;

export async function initDB() {
  if (db) return db;

  try {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `/sql.js/${file}`,
    });

    // 尝试从 localStorage 恢复数据库
    const saved = localStorage.getItem('seedream_db');
    if (saved) {
      const uint8Array = new Uint8Array(saved.split(',').map(Number));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
    }

    // 创建表（如果不存在）
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt INTEGER,
        updatedAt INTEGER
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS picturebooks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        theme TEXT NOT NULL,
        description TEXT,
        ageGroup TEXT NOT NULL,
        style TEXT NOT NULL,
        pageCount INTEGER DEFAULT 10,
        storyData TEXT NOT NULL,
        coverImage TEXT,
        isPublished INTEGER DEFAULT 0,
        viewCount INTEGER DEFAULT 0,
        createdAt INTEGER,
        updatedAt INTEGER
      );
    `);

    return db;
  } catch (err) {
    console.error('[DB] 初始化失败:', err);
    throw new Error(
      '数据库初始化失败。可能原因：1) 浏览器不支持 WebAssembly；2) 存储空间不足。请尝试清除缓存后重试。'
    );
  }
}

function persist() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem('seedream_db', Array.from(data).join(','));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ========== 用户操作 ==========

export async function createLocalUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  await initDB();
  const id = generateId();
  const now = Date.now();

  db.run(
    'INSERT INTO users (id, name, email, password, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, ?, ?)',
    [id, data.name, data.email, data.password, now, now]
  );
  persist();

  return {
    id,
    name: data.name,
    email: data.email,
    isActive: true,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

export async function getLocalUserByEmail(email: string) {
  await initDB();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email]);

  let result = null;
  while (stmt.step()) {
    const row = stmt.getAsObject();
    result = {
      ...row,
      isActive: row.isActive === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
  stmt.free();
  return result;
}

export async function getLocalUserById(id: string) {
  await initDB();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([id]);

  let result = null;
  while (stmt.step()) {
    const row = stmt.getAsObject();
    result = {
      ...row,
      isActive: row.isActive === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
  stmt.free();
  return result;
}

// ========== 绘本操作 ==========

export async function createLocalPicturebook(data: {
  userId: string;
  title: string;
  theme: string;
  description?: string;
  ageGroup: string;
  style: string;
  pageCount: number;
  storyData: any;
  coverImage?: string;
}) {
  await initDB();
  const id = generateId();
  const now = Date.now();

  db.run(
    'INSERT INTO picturebooks (id, userId, title, theme, description, ageGroup, style, pageCount, storyData, coverImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      data.userId,
      data.title,
      data.theme,
      data.description || '',
      data.ageGroup,
      data.style,
      data.pageCount,
      JSON.stringify(data.storyData),
      data.coverImage || '',
      now,
      now,
    ]
  );
  persist();

  return {
    id,
    ...data,
    isPublished: false,
    viewCount: 0,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

export async function getLocalPicturebooks(userId: string) {
  await initDB();
  const stmt = db.prepare('SELECT * FROM picturebooks WHERE userId = ? ORDER BY createdAt DESC');
  stmt.bind([userId]);

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      ...row,
      storyData: JSON.parse(row.storyData || '{}'),
      isPublished: row.isPublished === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
  stmt.free();
  return results;
}

export async function getLocalPicturebookById(id: string) {
  await initDB();
  const stmt = db.prepare('SELECT * FROM picturebooks WHERE id = ?');
  stmt.bind([id]);

  let result = null;
  while (stmt.step()) {
    const row = stmt.getAsObject();
    result = {
      ...row,
      storyData: JSON.parse(row.storyData || '{}'),
      isPublished: row.isPublished === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
  stmt.free();
  return result;
}

export async function updateLocalPicturebook(id: string, data: any) {
  await initDB();
  const now = Date.now();

  const keys = Object.keys(data);
  const values = keys.map((key) => {
    if (key === 'storyData') return JSON.stringify(data[key]);
    return data[key];
  });

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  db.run(`UPDATE picturebooks SET ${setClause}, updatedAt = ? WHERE id = ?`, [
    ...values,
    now,
    id,
  ]);
  persist();

  return getLocalPicturebookById(id);
}

export async function deleteLocalPicturebook(id: string) {
  await initDB();
  db.run('DELETE FROM picturebooks WHERE id = ?', [id]);
  persist();
  return true;
}
