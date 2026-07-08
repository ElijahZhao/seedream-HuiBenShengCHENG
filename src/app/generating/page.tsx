'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, BookOpen, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateImage } from '@/lib/volcengine';
import { getStylePrompt } from '@/lib/styleConfig';
import { createLocalPicturebook } from '@/lib/db';
import { getAuthUser } from '@/lib/localAuth';

interface Scene {
  id: string;
  shotType: string;
  description: string;
  text: string;
  imageUrl?: string | null;
}

const MAX_RETRIES = 2;
const CONCURRENCY_LIMIT = 3;

export default function GeneratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('准备生成...');
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storyData = localStorage.getItem('generatedStory');
    if (!storyData) {
      router.push('/create');
      return;
    }

    const story = JSON.parse(storyData);
    const scenes: Scene[] = story.scenes || [];

    if (scenes.length === 0) {
      router.push('/create');
      return;
    }

    const generateAllImages = async () => {
      try {
        const stylePrompt = getStylePrompt(story.style || 'watercolor');
        const theme = story.theme || '';
        const characters = story.characters || [];
        const ageGroup = story.ageGroup || '3-5';

        let characterPrompt = '';
        if (characters.length > 0) {
          characterPrompt = '\n角色设定：\n' + characters.map((char: any) =>
            `- ${char.name}：${char.description}（${char.role}）`
          ).join('\n');
        }

        const completedScenes: Scene[] = new Array(scenes.length).fill(null) as Scene[];
        let completedCount = 0;

        // 并发生成（限制并发数）
        const executing = new Set<Promise<void>>();

        for (let i = 0; i < scenes.length; i++) {
          const scene = scenes[i];

          const task = (async () => {
            const prompt = `${stylePrompt}。故事主题：${theme}${characterPrompt}\n\n场景描述：${scene.description}。适合${ageGroup}岁儿童。高质量插画，细节丰富，保持角色一致性。`;
            let lastError: Error | null = null;

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
              try {
                const imageUrl = await generateImage(prompt, { size: '2k' });

                completedScenes[i] = { ...scene, imageUrl };
                completedCount++;

                setGeneratedImages(prev => ({ ...prev, [scene.id]: imageUrl }));
                setProgress(Math.round((completedCount / scenes.length) * 100));
                setCurrentStep(`场景 ${i + 1}/${scenes.length} 生成完成`);

                return;
              } catch (err) {
                lastError = err instanceof Error ? err : new Error(String(err));
                if (attempt < MAX_RETRIES) {
                  await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
                }
              }
            }

            // 全部重试失败
            completedCount++;
            setProgress(Math.round((completedCount / scenes.length) * 100));
            setCurrentStep(`场景 ${i + 1}/${scenes.length} 生成失败`);
          })();

          executing.add(task);
          task.finally(() => executing.delete(task));

          if (executing.size >= CONCURRENCY_LIMIT) {
            await Promise.race(executing);
          }
        }

        await Promise.all(executing);

        // 保存结果到 localStorage
        const updatedScenes = completedScenes.map((s, idx) => {
          if (s && s.imageUrl) return s;
          return { ...scenes[idx], imageUrl: null };
        });

        const updatedStory = { ...story, scenes: updatedScenes };
        localStorage.setItem('generatedStory', JSON.stringify(updatedStory));

        // 自动保存到作品库
        try {
          const authUser = getAuthUser();
          const title = story.title || '未命名绘本';
          const coverImage = updatedScenes.find((s: Scene) => s.imageUrl)?.imageUrl || '';
          await createLocalPicturebook({
            title,
            coverImage,
            pageCount: updatedScenes.length,
            storyData: updatedStory,
            userId: authUser?.id || 'guest',
            theme: story.theme || '',
            ageGroup: story.ageGroup || '3-5',
            style: story.style || 'watercolor',
          });
          console.log('[Generating] Auto-saved picturebook:', title);
        } catch (saveErr) {
          console.warn('[Generating] Auto-save failed:', saveErr);
        }

        // 生成完成后直接跳转到预览页面
        setTimeout(() => {
          router.push('/preview');
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成图片失败');
      }
    };

    generateAllImages();
  }, [router]);

  const storyData = typeof window !== 'undefined' ? localStorage.getItem('generatedStory') : null;
  const story = storyData ? JSON.parse(storyData) : null;
  const scenes: Scene[] = story?.scenes || [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="w-full max-w-4xl px-4">
        <Card className="border-2 border-purple-100 bg-white/80 shadow-soft-lg backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                {error ? (
                  <AlertCircle className="h-10 w-10 text-white" />
                ) : (
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-heading">
              {error ? '生成失败' : '正在生成绘本...'}
            </CardTitle>
            <CardDescription className="text-lg">
              {error ? error : 'AI 正在为你创作精美的绘本插画'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-muted-foreground">当前进度</span>
                <span className="font-semibold text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-center font-body text-muted-foreground">
                {currentStep}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {scenes.map((scene: Scene, index: number) => {
                const imageUrl = generatedImages[scene.id];
                const isCompleted = imageUrl !== undefined;
                const isCurrent = Math.floor((progress / 100) * scenes.length) === index;

                return (
                  <div
                    key={scene.id}
                    className="relative overflow-hidden rounded-lg border-2 bg-purple-50"
                  >
                    <div
                      className={`aspect-[4/3] flex items-center justify-center transition-opacity ${
                        isCompleted ? 'opacity-100' : isCurrent ? 'opacity-60' : 'opacity-30'
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`场景 ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : isCompleted ? (
                        <div className="text-center">
                          <Sparkles className="mx-auto h-8 w-8 text-purple-500" />
                          <p className="mt-2 text-xs font-body text-muted-foreground">
                            已生成
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-6 w-6 text-purple-300" />
                          <p className="mt-2 text-xs font-body text-muted-foreground">
                            {isCurrent ? '生成中...' : '等待中...'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-purple-100">
                      <p className="truncate text-xs font-heading font-semibold">
                        场景 {index + 1}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {!error && (
              <div className="rounded-lg border-2 border-pink-100 bg-pink-50 p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-500" />
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      正在精心绘制每一页
                    </p>
                    <p className="mt-1 text-sm font-body text-muted-foreground">
                      AI 正在根据分镜描述生成高质量插画，请稍候片刻...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push('/storyboard')}
                  variant="outline"
                  className="h-12"
                >
                  返回分镜页面
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
