'use client';

import { useEffect } from 'react';
import { runDiagnostics, printDiagReport } from '@/lib/diagnostics';

/**
 * 自动诊断组件
 * 应用启动时静默运行一次诊断，将结果输出到 console
 * 仅在有问题的项目或开发模式下输出
 */
export default function AutoDiagnostics() {
  useEffect(() => {
    // 延迟 3 秒运行，避免阻塞首屏加载
    const timer = setTimeout(async () => {
      try {
        const report = await runDiagnostics();
        printDiagReport(report);
      } catch (err) {
        console.error('[AutoDiagnostics] 诊断运行失败:', err);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
