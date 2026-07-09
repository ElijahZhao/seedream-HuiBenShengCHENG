'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { loadStory } from '@/lib/storyStorage';

interface Character {
  name: string;
  description: string;
  role: string;
}

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 读取生成的故事
    const storyData = await loadStory();
    if (!storyData) {
      router.push('/create');
      return;
    }

    try {
      const story = JSON.parse(storyData);
      setCharacters(story.characters || []);
    } catch (error) {
      console.error('解析故事数据失败:', error);
      router.push('/create');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleNext = () => {
    // 跳转到分镜页面
    router.push('/storyboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-3 w-3 animate-bounce rounded-full bg-purple-500"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="font-heading font-semibold text-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/create">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回上一步
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-pink-500" />
              <span className="font-heading font-semibold text-foreground">角色设计</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-sm font-body text-muted-foreground">
            <span>步骤 2/4: 角色确认</span>
            <span>50%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-purple-100">
            <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 transition-all" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-heading font-bold text-foreground">
              故事角色
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              查看 AI 为你设计的角色，可以修改描述
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {characters.map((character, index) => (
              <Card
                key={index}
                className="border-2 border-pink-100 bg-white/80 shadow-soft-md backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-heading text-xl">
                    {character.name}
                  </CardTitle>
                  <CardDescription>{character.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    defaultValue={character.description}
                    placeholder="角色描述"
                    className="min-h-24 text-base"
                    readOnly
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleNext}
              size="lg"
              className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg font-body font-semibold hover:from-purple-600 hover:to-pink-600"
            >
              下一步：分镜设计
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
