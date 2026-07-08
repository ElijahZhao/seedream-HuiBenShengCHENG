/**
 * Seedream 故障自诊断系统
 * 运行时自动检测关键模块状态，输出详细报告
 */

import { getApiKey } from './localAuth';
import { initDB } from './db';
import { styleExampleImages } from '@/config/styleImages';
import { getStorageBackendName, getStorage } from './storage';

export type DiagStatus = 'pass' | 'fail' | 'warn' | 'running';

export interface DiagResult {
  id: string;
  name: string;
  status: DiagStatus;
  message: string;
  detail?: string;
  durationMs?: number;
}

export interface DiagReport {
  timestamp: string;
  results: DiagResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  environment: {
    userAgent: string;
    platform: string;
    language: string;
    isTauri: boolean;
    isCapacitor: boolean;
    storageBackend: string;
  };
}

// ========== 环境检测 ==========

function detectEnvironment(storageBackend: string) {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  return {
    userAgent: ua,
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
    isTauri: (window as any).__TAURI__ !== undefined,
    isCapacitor: (window as any).Capacitor !== undefined,
    storageBackend,
  };
}

// ========== 各项检查 ==========

async function checkStorageBackend(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const backendName = await getStorageBackendName();
    const storage = await getStorage();

    // 测试读写
    const testKey = '__seedream_diag_test__';
    await storage.save(testKey, 'ok');
    const val = await storage.load(testKey);
    await storage.remove(testKey);

    if (val !== 'ok') {
      return {
        id: 'storageBackend',
        name: '存储后端',
        status: 'fail',
        message: '存储后端读写测试失败',
        detail: `${backendName} 后端初始化成功但读写异常`,
        durationMs: Math.round(performance.now() - start),
      };
    }

    const backendDesc: Record<string, string> = {
      'Tauri FS': 'Tauri 原生文件系统（AppData）',
      'Capacitor FS': 'Capacitor 文件系统（沙箱）',
      'IndexedDB': '浏览器 IndexedDB（推荐）',
      'localStorage': '浏览器 localStorage（降级）',
    };

    const isFallback = backendName === 'localStorage';

    return {
      id: 'storageBackend',
      name: '存储后端',
      status: isFallback ? 'warn' : 'pass',
      message: `使用 ${backendDesc[backendName] || backendName}`,
      detail: isFallback
        ? 'localStorage 容量有限（约 5-10MB），建议升级到支持 IndexedDB 或原生文件系统的环境'
        : '存储后端工作正常，容量不受限',
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'storageBackend',
      name: '存储后端',
      status: 'fail',
      message: '存储后端初始化失败',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkLocalStorage(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const testKey = '__seedream_diag_test__';
    localStorage.setItem(testKey, 'ok');
    const val = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (val !== 'ok') {
      return {
        id: 'localStorage',
        name: '降级存储 (localStorage)',
        status: 'fail',
        message: 'localStorage 读写测试失败',
        detail: '浏览器可能禁用了本地存储，或处于无痕模式',
        durationMs: Math.round(performance.now() - start),
      };
    }

    // 检查容量
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      used += key.length + (localStorage.getItem(key)?.length || 0);
    }
    const usedMB = (used * 2 / 1024 / 1024).toFixed(2);

    return {
      id: 'localStorage',
      name: '降级存储 (localStorage)',
      status: 'pass',
      message: 'localStorage 读写正常',
      detail: `已使用约 ${usedMB} MB`,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'localStorage',
      name: '降级存储 (localStorage)',
      status: 'fail',
      message: 'localStorage 不可用',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkApiKeySet(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const key = getApiKey();
    const masked = key.length > 8 ? key.slice(0, 4) + '****' + key.slice(-4) : '****';
    const isArkFormat = key.startsWith('ark-');

    return {
      id: 'apiKeySet',
      name: 'API Key 已设置',
      status: isArkFormat ? 'pass' : 'warn',
      message: isArkFormat ? `API Key 已设置 (${masked})` : `API Key 格式异常 (${masked})`,
      detail: isArkFormat
        ? 'Key 格式正确（以 ark- 开头）'
        : 'Key 应该以 "ark-" 开头，请检查是否复制正确',
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: 'apiKeySet',
      name: 'API Key 已设置',
      status: 'fail',
      message: '未设置 API Key',
      detail: '请先在「设置」页面配置火山方舟 API Key',
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkApiKeyValid(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const key = getApiKey();
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-mini-260215',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
    });

    if (response.ok) {
      return {
        id: 'apiKeyValid',
        name: 'API Key 有效性',
        status: 'pass',
        message: 'API Key 有效，可正常调用服务',
        detail: `HTTP ${response.status}`,
        durationMs: Math.round(performance.now() - start),
      };
    }

    const text = await response.text();
    return {
      id: 'apiKeyValid',
      name: 'API Key 有效性',
      status: 'fail',
      message: `API Key 无效 (HTTP ${response.status})`,
      detail: text.slice(0, 200),
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'apiKeyValid',
      name: 'API Key 有效性',
      status: 'fail',
      message: '无法连接火山方舟 API',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkSqlJsWASM(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const wasmPath = '/sql.js/sql-wasm.wasm';
    const response = await fetch(wasmPath, { method: 'HEAD' });

    if (response.ok) {
      const size = response.headers.get('content-length');
      return {
        id: 'sqlJsWASM',
        name: 'SQLite WASM 文件',
        status: 'pass',
        message: 'sql.js WASM 文件可访问',
        detail: size ? `文件大小: ${(Number(size) / 1024 / 1024).toFixed(2)} MB` : undefined,
        durationMs: Math.round(performance.now() - start),
      };
    }

    return {
      id: 'sqlJsWASM',
      name: 'SQLite WASM 文件',
      status: 'fail',
      message: `WASM 文件不可访问 (HTTP ${response.status})`,
      detail: `路径: ${wasmPath}，请确认 public/sql.js/ 目录存在`,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'sqlJsWASM',
      name: 'SQLite WASM 文件',
      status: 'fail',
      message: '无法加载 sql.js WASM 文件',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkDatabase(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const dbInstance = await initDB();

    // 检查表是否存在
    const tablesResult = dbInstance.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = tablesResult[0]?.values?.map((v: any[]) => v[0]) || [];
    const hasUsers = tables.includes('users');
    const hasBooks = tables.includes('picturebooks');

    if (hasUsers && hasBooks) {
      // 统计数据
      const userCount = dbInstance.exec('SELECT COUNT(*) FROM users')[0]?.values?.[0]?.[0] || 0;
      const bookCount = dbInstance.exec('SELECT COUNT(*) FROM picturebooks')[0]?.values?.[0]?.[0] || 0;

      return {
        id: 'database',
        name: '本地数据库',
        status: 'pass',
        message: '数据库初始化正常',
        detail: `表结构完整 | 用户: ${userCount} 人 | 绘本: ${bookCount} 本`,
        durationMs: Math.round(performance.now() - start),
      };
    }

    return {
      id: 'database',
      name: '本地数据库',
      status: 'warn',
      message: '数据库存在但表结构异常',
      detail: `发现的表: ${tables.join(', ') || '无'}`,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'database',
      name: '本地数据库',
      status: 'fail',
      message: '数据库初始化失败',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkBcryptjs(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const { hash, compare } = await import('bcryptjs');
    const testPassword = 'seedream_test_123';
    const hashed = await hash(testPassword, 4);
    const isMatch = await compare(testPassword, hashed);

    if (isMatch) {
      return {
        id: 'bcryptjs',
        name: '密码加密 (bcryptjs)',
        status: 'pass',
        message: 'bcryptjs 哈希和校验正常',
        detail: `哈希耗时: ${Math.round(performance.now() - start)}ms`,
        durationMs: Math.round(performance.now() - start),
      };
    }

    return {
      id: 'bcryptjs',
      name: '密码加密 (bcryptjs)',
      status: 'fail',
      message: 'bcryptjs 校验失败',
      detail: '哈希值生成成功但校验不匹配',
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'bcryptjs',
      name: '密码加密 (bcryptjs)',
      status: 'fail',
      message: 'bcryptjs 加载或执行失败',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

async function checkStyleImages(): Promise<DiagResult> {
  const start = performance.now();
  const entries = Object.entries(styleExampleImages);
  const results: { key: string; ok: boolean; status: number }[] = [];

  for (const [key, url] of entries) {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      // no-cors 模式下无法读取 status，只能判断是否网络错误
      results.push({ key, ok: true, status: 0 });
    } catch {
      results.push({ key, ok: false, status: 0 });
    }
  }

  const failed = results.filter(r => !r.ok);

  if (failed.length === 0) {
    return {
      id: 'styleImages',
      name: '风格预览图片',
      status: 'pass',
      message: `${entries.length} 张风格图片全部可加载`,
      durationMs: Math.round(performance.now() - start),
    };
  }

  return {
    id: 'styleImages',
    name: '风格预览图片',
    status: 'warn',
    message: `${failed.length}/${entries.length} 张图片可能加载失败`,
    detail: `失败项: ${failed.map(f => f.key).join(', ')}`,
    durationMs: Math.round(performance.now() - start),
  };
}

async function checkNetwork(): Promise<DiagResult> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch('https://ark.cn-beijing.volces.com', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    });

    clearTimeout(timeout);
    return {
      id: 'network',
      name: '网络连接',
      status: 'pass',
      message: '网络连接正常',
      detail: '可以访问火山方舟域名',
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      id: 'network',
      name: '网络连接',
      status: 'fail',
      message: '网络连接异常',
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

// ========== 主入口 ==========

export async function runDiagnostics(): Promise<DiagReport> {
  const results: DiagResult[] = [];

  // 存储后端检测放在第一位
  results.push(await checkStorageBackend());
  results.push(await checkLocalStorage());
  results.push(await checkNetwork());
  results.push(await checkApiKeySet());

  // 如果 API Key 已设置，再测试有效性
  const apiKeyResult = results.find(r => r.id === 'apiKeySet');
  if (apiKeyResult?.status !== 'fail') {
    results.push(await checkApiKeyValid());
  }

  results.push(await checkSqlJsWASM());
  results.push(await checkDatabase());
  results.push(await checkBcryptjs());
  results.push(await checkStyleImages());

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warn').length;

  const storageBackend = await getStorageBackendName().catch(() => 'unknown');

  return {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      warnings,
    },
    environment: detectEnvironment(storageBackend),
  };
}

/**
 * 在 console 输出诊断报告（便于开发者调试）
 */
export function printDiagReport(report: DiagReport) {
  const { summary, environment } = report;

  console.group('🔍 Seedream 故障自诊断报告');
  console.log(`时间: ${report.timestamp}`);
  console.log(`环境: ${environment.isTauri ? 'Tauri' : environment.isCapacitor ? 'Capacitor' : 'Web'} | ${environment.platform} | ${environment.language}`);
  console.log(`存储: ${environment.storageBackend}`);
  console.log(`结果: ✅ ${summary.passed} 通过 | ❌ ${summary.failed} 失败 | ⚠️ ${summary.warnings} 警告`);
  console.log('');

  for (const r of report.results) {
    const icon = r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : '⚠️';
    console.group(`${icon} ${r.name}`);
    console.log(r.message);
    if (r.detail) console.log(`详情: ${r.detail}`);
    if (r.durationMs) console.log(`耗时: ${r.durationMs}ms`);
    console.groupEnd();
  }

  console.groupEnd();

  // 如果有失败项，在 console 最外层再提醒一次
  if (summary.failed > 0) {
    console.error(`⚠️ Seedream 诊断发现 ${summary.failed} 个问题，请检查上方详细报告`);
  }
}
