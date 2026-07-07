'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, ClipboardCopy, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { runDiagnostics, printDiagReport, type DiagReport, type DiagResult } from '@/lib/diagnostics';

function StatusIcon({ status }: { status: DiagResult['status'] }) {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === 'fail') return <XCircle className="h-5 w-5 text-red-500" />;
  return <AlertTriangle className="h-5 w-5 text-amber-500" />;
}

function StatusBadge({ status }: { status: DiagResult['status'] }) {
  if (status === 'pass') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">通过</Badge>;
  if (status === 'fail') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">失败</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">警告</Badge>;
}

export default function DiagnosticsPage() {
  const [report, setReport] = useState<DiagReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    setReport(null);
    try {
      const result = await runDiagnostics();
      setReport(result);
      printDiagReport(result);
    } catch (err) {
      console.error('诊断运行失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
  }, []);

  const copyReport = () => {
    if (!report) return;
    const lines: string[] = [
      '🔍 Seedream 故障自诊断报告',
      `时间: ${report.timestamp}`,
      `环境: ${report.environment.isTauri ? 'Tauri' : report.environment.isCapacitor ? 'Capacitor' : 'Web'} | ${report.environment.platform}`,
      `结果: ✅ ${report.summary.passed} 通过 | ❌ ${report.summary.failed} 失败 | ⚠️ ${report.summary.warnings} 警告`,
      '',
    ];

    for (const r of report.results) {
      const icon = r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : '⚠️';
      lines.push(`${icon} ${r.name}: ${r.message}`);
      if (r.detail) lines.push(`   详情: ${r.detail}`);
      if (r.durationMs) lines.push(`   耗时: ${r.durationMs}ms`);
    }

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">返回首页</Button>
            </Link>
            <h1 className="text-lg font-semibold">故障诊断</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyReport}
              disabled={!report || loading}
            >
              {copied ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <ClipboardCopy className="h-4 w-4 mr-1" />}
              {copied ? '已复制' : '复制报告'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={run}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              重新检测
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {loading && !report && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <p className="text-muted-foreground">正在运行全面诊断...</p>
          </div>
        )}

        {report && (
          <>
            {/* 总览卡片 */}
            <Card className="mb-6 border-2">
              <CardHeader>
                <CardTitle className="text-base">诊断概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-green-600">{report.summary.passed}</div>
                    <div className="text-xs text-muted-foreground">通过</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-red-600">{report.summary.failed}</div>
                    <div className="text-xs text-muted-foreground">失败</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-amber-600">{report.summary.warnings}</div>
                    <div className="text-xs text-muted-foreground">警告</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>平台: {report.environment.isTauri ? 'Tauri 桌面端' : report.environment.isCapacitor ? 'Capacitor 移动端' : 'Web 浏览器'}</p>
                  <p>系统: {report.environment.platform}</p>
                  <p>语言: {report.environment.language}</p>
                  <p>时间: {new Date(report.timestamp).toLocaleString()}</p>
                </div>

                {report.summary.failed > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    发现 {report.summary.failed} 个问题，请查看下方详情。如果无法解决，可复制报告发给开发者。
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 逐项结果 */}
            <div className="space-y-3">
              {report.results.map((r) => (
                <Card key={r.id} className={`border-l-4 ${
                  r.status === 'pass' ? 'border-l-green-500' :
                  r.status === 'fail' ? 'border-l-red-500' : 'border-l-amber-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon status={r.status} />
                        <div>
                          <div className="font-medium text-sm">{r.name}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">{r.message}</div>
                          {r.detail && (
                            <div className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-1 rounded">
                              {r.detail}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.durationMs !== undefined && (
                          <span className="text-xs text-muted-foreground">{r.durationMs}ms</span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
