'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Camera, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Scene {
  id: string;
  shotType: string;
  description: string;
  text: string;
  characters: string[];
}

export default function StoryboardPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScene, setSelectedScene] = useState(0);

  useEffect(() => {
    // 从 localStorage 读取生成的故事
    const storyData = localStorage.getItem('generatedStory');
    if (!storyData) {
      router.push('/create');
      return;
    }

    try {
      const story = JSON.parse(storyData);
      setScenes(story.scenes || []);
    } catch (error) {
      console.error('解析故事数据失败:', error);
      router.push('/create');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 编辑后同步回 localStorage
  useEffect(() => {
    if (scenes.length > 0) {
      try {
        const storyData = localStorage.getItem('generatedStory');
        if (storyData) {
          const story = JSON.parse(storyData);
          story.scenes = scenes;
          localStorage.setItem('generatedStory', JSON.stringify(story));
        }
      } catch (error) {
        console.error('同步分镜数据失败:', error);
      }
    }
  }, [scenes]);

  const handleGenerate = () => {
    // 跳转到生成页面
    router.push('/generating');
  };

  const getShotTypeLabel = (shotType: string) => {
    const labels: Record<string, string> = {
      full: '全景',
      medium: '中景',
      closeup: '近景',
      'extreme closeup': '特写',
    };
    return labels[shotType] || shotType;
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
            <Link href="/characters">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回上一步
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-orange-500" />
              <span className="font-heading font-semibold text-foreground">分镜设计</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-sm font-body text-muted-foreground">
            <span>步骤 3/4: 分镜确认</span>
            <span>75%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-purple-100">
            <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 transition-all" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-heading font-bold text-foreground">
              故事分镜
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              查看 AI 为你设计的 {scenes.length} 个场景分镜
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Scene List */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-purple-100 bg-white/80 shadow-soft-md backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-heading">场景列表</CardTitle>
                  <CardDescription>点击查看详情</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scenes.map((scene, index) => (
                      <button
                        key={scene.id}
                        onClick={() => setSelectedScene(index)}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                          selectedScene === index
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-border bg-white hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-semibold text-foreground">
                            场景 {index + 1}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getShotTypeLabel(scene.shotType)}
                          </Badge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm font-body text-muted-foreground">
                          {scene.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scene Detail */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-orange-100 bg-white/80 shadow-soft-md backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between font-heading">
                    <span>场景 {selectedScene + 1}</span>
                    <Badge>{getShotTypeLabel(scenes[selectedScene]?.shotType || 'medium')}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {scenes[selectedScene]?.text}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 画面描述 */}
                  <div>
                    <label className="mb-2 block text-sm font-body font-semibold text-foreground">
                      画面描述
                    </label>
                    <Textarea
                      value={scenes[selectedScene]?.description || ''}
                      placeholder="画面详细描述"
                      className="min-h-32 text-base"
                      onChange={(e) => {
                        const newScenes = [...scenes];
                        newScenes[selectedScene] = { ...newScenes[selectedScene], description: e.target.value };
                        setScenes(newScenes);
                      }}
                    />
                  </div>

                  {/* 旁白文字 */}
                  <div>
                    <label className="mb-2 block text-sm font-body font-semibold text-foreground">
                      旁白文字
                    </label>
                    <Textarea
                      value={scenes[selectedScene]?.text || ''}
                      placeholder="该页的旁白文字"
                      className="min-h-20 text-base"
                      onChange={(e) => {
                        const newScenes = [...scenes];
                        newScenes[selectedScene] = { ...newScenes[selectedScene], text: e.target.value };
                        setScenes(newScenes);
                      }}
                    />
                  </div>

                  {/* 出现角色 */}
                  {scenes[selectedScene]?.characters && scenes[selectedScene].characters.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-body font-semibold text-foreground">
                        出现角色
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {scenes[selectedScene].characters.map((char, idx) => (
                          <Badge key={idx} variant="outline" className="font-body">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedScene(Math.max(0, selectedScene - 1))}
                  disabled={selectedScene === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  上一个场景
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedScene(Math.min(scenes.length - 1, selectedScene + 1))}
                  disabled={selectedScene === scenes.length - 1}
                >
                  下一个场景
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleGenerate}
                  size="lg"
                  className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg font-body font-semibold hover:from-purple-600 hover:to-pink-600"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  开始生成绘本
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
