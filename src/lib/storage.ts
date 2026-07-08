/**
 * Seedream 跨平台存储抽象层
 * 自动检测运行平台，选择最佳存储后端：
 *   Tauri    → 原生文件系统 (AppData)
 *   Capacitor → Filesystem 插件 (app 沙箱)
 *   Web      → IndexedDB (数百 MB 容量)
 *   Fallback → localStorage (兼容旧数据)
 */

// ========== 平台检测 ==========

type Platform = 'tauri' | 'capacitor' | 'web';

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  if ((window as any).__TAURI__ !== undefined) return 'tauri';
  if ((window as any).Capacitor !== undefined) return 'capacitor';
  return 'web';
}

// ========== 统一接口 ==========

export interface StorageBackend {
  load(name: string): Promise<string | null>;
  save(name: string, data: string): Promise<void>;
  loadBinary(name: string): Promise<Uint8Array | null>;
  saveBinary(name: string, data: Uint8Array): Promise<void>;
  remove(name: string): Promise<void>;
  readonly name: string;
}

// ========== Tauri 文件系统后端 ==========

class TauriBackend implements StorageBackend {
  name = 'Tauri FS';
  private fs: any = null;

  async init(): Promise<void> {
    if (this.fs) return;
    const fsMod = await import('@tauri-apps/plugin-fs');
    this.fs = fsMod;
  }

  private async ensureDir(dirPath: string): Promise<void> {
    const { mkdir, BaseDirectory } = this.fs;
    try {
      await mkdir(dirPath, { baseDir: BaseDirectory.AppData, recursive: true });
    } catch { /* 目录可能已存在 */ }
  }

  async load(name: string): Promise<string | null> {
    await this.init();
    const { readTextFile, BaseDirectory } = this.fs;
    try {
      return await readTextFile(`seedream/config/${name}.json`, { baseDir: BaseDirectory.AppData });
    } catch { return null; }
  }

  async save(name: string, data: string): Promise<void> {
    await this.init();
    const { writeTextFile, BaseDirectory } = this.fs;
    await this.ensureDir('seedream/config');
    await writeTextFile(`seedream/config/${name}.json`, data, { baseDir: BaseDirectory.AppData });
  }

  async loadBinary(name: string): Promise<Uint8Array | null> {
    await this.init();
    const { readFile, BaseDirectory } = this.fs;
    try {
      const data = await readFile(`seedream/db/${name}.db`, { baseDir: BaseDirectory.AppData });
      return new Uint8Array(data);
    } catch { return null; }
  }

  async saveBinary(name: string, data: Uint8Array): Promise<void> {
    await this.init();
    const { writeFile, BaseDirectory } = this.fs;
    await this.ensureDir('seedream/db');
    await writeFile(`seedream/db/${name}.db`, data, { baseDir: BaseDirectory.AppData });
  }

  async remove(name: string): Promise<void> {
    await this.init();
    const { remove, BaseDirectory } = this.fs;
    try { await remove(`seedream/config/${name}.json`, { baseDir: BaseDirectory.AppData }); } catch {}
    try { await remove(`seedream/db/${name}.db`, { baseDir: BaseDirectory.AppData }); } catch {}
  }
}

// ========== Capacitor 文件系统后端 ==========

class CapacitorBackend implements StorageBackend {
  name = 'Capacitor FS';
  private fs: any = null;

  async init(): Promise<void> {
    if (this.fs) return;
    const mod = await import('@capacitor/filesystem');
    this.fs = mod.Filesystem;
  }

  private async ensureDir(path: string): Promise<void> {
    try { await this.fs.mkdir({ path, directory: 'DATA', recursive: true }); } catch { /* 目录可能已存在 */ }
  }

  async load(name: string): Promise<string | null> {
    await this.init();
    try {
      const result = await this.fs.readFile({ path: `seedream/config/${name}.json`, directory: 'DATA', encoding: 'utf8' });
      return result.data;
    } catch { return null; }
  }

  async save(name: string, data: string): Promise<void> {
    await this.init();
    await this.ensureDir('seedream/config');
    await this.fs.writeFile({ path: `seedream/config/${name}.json`, data, directory: 'DATA', encoding: 'utf8' });
  }

  async loadBinary(name: string): Promise<Uint8Array | null> {
    await this.init();
    try {
      const result = await this.fs.readFile({ path: `seedream/db/${name}.db`, directory: 'DATA' });
      const binary = atob(result.data);
      return Uint8Array.from(binary, (c) => c.charCodeAt(0));
    } catch { return null; }
  }

  async saveBinary(name: string, data: Uint8Array): Promise<void> {
    await this.init();
    await this.ensureDir('seedream/db');
    const base64 = btoa(String.fromCharCode(...data));
    await this.fs.writeFile({ path: `seedream/db/${name}.db`, data: base64, directory: 'DATA' });
  }

  async remove(name: string): Promise<void> {
    await this.init();
    try { await this.fs.deleteFile({ path: `seedream/config/${name}.json`, directory: 'DATA' }); } catch {}
    try { await this.fs.deleteFile({ path: `seedream/db/${name}.db`, directory: 'DATA' }); } catch {}
  }
}

// ========== IndexedDB 后端 ==========

class IndexedDBBackend implements StorageBackend {
  name = 'IndexedDB';
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'seedream_storage_v2';
  private readonly STORE_NAME = 'data';
  private readonly DB_VERSION = 1;

  private async ensureDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onupgradeneeded = () => { request.result.createObjectStore(this.STORE_NAME, { keyPath: 'name' }); };
      request.onsuccess = () => { this.db = request.result; resolve(this.db); };
      request.onerror = () => reject(request.error);
    });
  }

  async load(name: string): Promise<string | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.get(name);
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
      request.onerror = () => reject(request.error);
    });
  }

  async save(name: string, data: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.put({ name, value: data, updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadBinary(name: string): Promise<Uint8Array | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.get(`${name}_bin`);
      request.onsuccess = () => resolve(request.result ? new Uint8Array(request.result.value) : null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBinary(name: string, data: Uint8Array): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.put({ name: `${name}_bin`, value: Array.from(data), updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async remove(name: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      store.delete(name); store.delete(`${name}_bin`);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

// ========== localStorage 降级后端 ==========

class LocalStorageFallback implements StorageBackend {
  name = 'localStorage';

  async load(name: string): Promise<string | null> {
    return localStorage.getItem(`seedream_storage_${name}`);
  }
  async save(name: string, data: string): Promise<void> {
    localStorage.setItem(`seedream_storage_${name}`, data);
  }
  async loadBinary(name: string): Promise<Uint8Array | null> {
    const saved = localStorage.getItem(`seedream_storage_${name}_bin`);
    return saved ? new Uint8Array(saved.split(',').map(Number)) : null;
  }
  async saveBinary(name: string, data: Uint8Array): Promise<void> {
    localStorage.setItem(`seedream_storage_${name}_bin`, Array.from(data).join(','));
  }
  async remove(name: string): Promise<void> {
    localStorage.removeItem(`seedream_storage_${name}`);
    localStorage.removeItem(`seedream_storage_${name}_bin`);
  }
}

// ========== 后端创建与自动选择 ==========

async function createBackend(): Promise<StorageBackend> {
  const platform = detectPlatform();

  if (platform === 'tauri') {
    try {
      const backend = new TauriBackend();
      await backend.init();
      console.log(`[Storage] Using ${backend.name} backend`);
      return backend;
    } catch (e) {
      console.warn('[Storage] Tauri fs plugin not available, trying next backend:', e);
    }
  }

  if (platform === 'capacitor') {
    try {
      const backend = new CapacitorBackend();
      await backend.init();
      console.log(`[Storage] Using ${backend.name} backend`);
      return backend;
    } catch (e) {
      console.warn('[Storage] Capacitor filesystem not available, trying next backend:', e);
    }
  }

  try {
    const backend = new IndexedDBBackend();
    await backend.save('__seedream_storage_test__', 'ok');
    const test = await backend.load('__seedream_storage_test__');
    if (test === 'ok') {
      await backend.remove('__seedream_storage_test__');
      console.log(`[Storage] Using ${backend.name} backend`);
      return backend;
    }
  } catch (e) {
    console.warn('[Storage] IndexedDB test failed, falling back:', e);
  }

  const fallback = new LocalStorageFallback();
  console.log(`[Storage] Using ${fallback.name} fallback backend`);
  return fallback;
}

// ========== 数据迁移（从旧版 localStorage） ==========

async function migrateFromLocalStorage(backend: StorageBackend): Promise<void> {
  if (backend.name === 'localStorage') return;

  const oldKeys = [
    { key: 'seedream_db', type: 'binary' as const },
    { key: 'seedream_auth', type: 'text' as const },
    { key: 'seedream_api_key', type: 'text' as const },
  ];

  for (const { key, type } of oldKeys) {
    const oldValue = localStorage.getItem(key);
    if (!oldValue) continue;

    const exists = type === 'binary'
      ? await backend.loadBinary(key)
      : await backend.load(key);
    if (exists) {
      localStorage.removeItem(key);
      continue;
    }

    if (type === 'binary') {
      await backend.saveBinary(key, new Uint8Array(oldValue.split(',').map(Number)));
    } else {
      await backend.save(key, oldValue);
    }
    localStorage.removeItem(key);
    console.log(`[Storage] Migrated ${key} from localStorage to ${backend.name}`);
  }
}

// ========== 单例导出 ==========

let storagePromise: Promise<StorageBackend> | null = null;

export async function getStorage(): Promise<StorageBackend> {
  if (!storagePromise) {
    storagePromise = createBackend().then(async (backend) => {
      await migrateFromLocalStorage(backend);
      return backend;
    });
  }
  return storagePromise;
}

export async function getStorageBackendName(): Promise<string> {
  const storage = await getStorage();
  return storage.name;
}

export function resetStorage(): void {
  storagePromise = null;
}
