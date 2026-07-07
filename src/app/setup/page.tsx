'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, ArrowRight, CheckCircle2, Loader2, Stethoscope } from 'lucide-react';
import { setApiKey, hasApiKey } from '@/lib/localAuth';
import { generateStoryStream } from '@/lib/volcengine';
import Link from 'next/link';

export default function SetupPage() {
  const [apiKey, setApiKeyValue] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showHasKeyNotice, setShowHasKeyNotice] = useState(false);

  // SSR-safe: check hasApiKey only on client
  useEffect(() => {
    setShowHasKeyNotice(hasApiKey());
  }, []);

  const handleTest = async () => {
    if (!apiKey.trim()) return;

    setTesting(true);
    setTestResult('idle');

    try {
      localStorage.setItem('seedream_api_key', apiKey.trim());

      // 测试 API 连通性
      let received = false;
      const stream = generateStoryStream(
        '回复"ok"',
        'say ok'
      );

      for await (const chunk of stream) {
        received = true;
        break;
      }

      if (received) {
        setTestResult('success');
        setApiKey(apiKey.trim());
      } else {
        setTestResult('fail');
      }
    } catch {
      setTestResult('fail');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setApiKey(apiKey.trim());
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 border-purple-100 shadow-clay-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Key className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-bold text-story-text">
            首次设置
          </CardTitle>
          <CardDescription className="text-base font-body">
            Seedream 需要火山方舟 API Key 来生成故事和插画
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 获取步骤 */}
          <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 text-sm space-y-2">
            <p className="font-heading font-semibold">如何获取 API Key：</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground font-body">
              <li>访问 console.volcengine.com/ark</li>
              <li>注册/登录火山引擎账号</li>
              <li>开通「豆包大模型」和「豆包图像创作模型」</li>
              <li>在「开通管理」→「API Key 管理」中创建 Key</li>
              <li>复制 Key（以 ark- 开头）粘贴到下方</li>
            </ol>
          </div>

          {/* 输入框 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="text"
              placeholder="ark-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKeyValue(e.target.value)}
              className="h-11 font-mono text-sm"
            />
          </div>

          {/* 测试按钮 */}
          <Button
            onClick={handleTest}
            variant="outline"
            className="w-full h-11"
            disabled={!apiKey.trim() || testing}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试连接中...
              </>
            ) : (
              '测试 API Key'
            )}
          </Button>

          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              API Key 有效，可以正常使用
            </div>
          )}

          {testResult === 'fail' && (
            <div className="space-y-2">
              <div className="text-red-500 text-sm">
                API Key 无效或网络异常，请检查后重试
              </div>
              <Link href="/diagnostics">
                <Button variant="ghost" size="sm" className="text-purple-600 h-8">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  运行全面诊断
                </Button>
              </Link>
            </div>
          )}

          {/* 继续按钮 */}
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            disabled={!apiKey.trim()}
          >
            保存并继续
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {showHasKeyNotice && (
            <p className="text-center text-xs text-muted-foreground">
              已有保存的 API Key，重新设置将覆盖
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
