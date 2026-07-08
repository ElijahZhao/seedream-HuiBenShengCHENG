'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { verifyPassword } from '@/lib/crypto';
import { getLocalUserByEmail } from '@/lib/db';
import { setAuthUser } from '@/lib/localAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const existingUser = await getLocalUserByEmail(formData.email);

      if (!existingUser) {
        setError('邮箱或密码不正确');
        setLoading(false);
        return;
      }

      const isValid = await verifyPassword(formData.password, existingUser.password);
      if (!isValid) {
        setError('邮箱或密码不正确');
        setLoading(false);
        return;
      }

      setAuthUser({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        isLoggedIn: true,
      });

      window.location.href = '/';
    } catch (err) {
      const msg = err instanceof Error ? err.message : '请稍后重试';
      setError(`登录失败：${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-purple-100 shadow-clay-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-bold text-story-text">欢迎回来</CardTitle>
          <CardDescription className="text-base font-body">
            登录 Seedream 绘本，继续您的创作之旅
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              还没有账号？{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                立即注册
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
