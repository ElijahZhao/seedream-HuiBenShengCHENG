'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Eye, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { getLocalPicturebooks, getLocalPicturebookById, deleteLocalPicturebook } from '@/lib/db';
import { getAuthUser } from '@/lib/localAuth';

interface Picturebook {
  id: string;
  title: string;
  theme: string;
  ageGroup: string;
  style: string;
  coverImage?: string | null;
  createdAt: string;
  viewCount: number;
}

export default function MyWorksPage() {
  const router = useRouter();
  const [works, setWorks] = useState<Picturebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const user = getAuthUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const picturebooks = await getLocalPicturebooks(user.id);
      setWorks(picturebooks.map((pb: any) => ({
        id: pb.id,
        title: pb.title,
        theme: pb.theme,
        ageGroup: pb.ageGroup,
        style: pb.style,
        coverImage: pb.storyData?.scenes?.[0]?.imageUrl || pb.coverImage || null,
        createdAt: pb.createdAt,
        viewCount: pb.viewCount || 0,
      })));
    } catch (error) {
      console.error('加载作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStyleName = (style: string) => {
    const styleMap: Record<string, string> = {
      watercolor: '水彩风',
      anime: '动漫风',
      clay: '黏土风',
      sketch: '素描风',
      pastel: '粉彩风',
      pop: '波普风',
    };
    return styleMap[style] || style;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handlePreview = async (id: string) => {
    try {
      const pb = await getLocalPicturebookById(id);
      if (pb) {
        localStorage.setItem('generatedStory', JSON.stringify(pb.storyData));
        router.push('/preview');
      } else {
        alert('作品数据不存在');
      }
    } catch (error) {
      console.error('加载作品失败:', error);
      alert('加载作品失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个绘本吗？')) {
      return;
    }

    try {
      await deleteLocalPicturebook(id);
      loadWorks();
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <AnimatedBackground />
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                返回首页
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <span className="text-xl font-heading font-bold text-foreground">我的作品</span>
            </div>
            <Link href="/create">
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="mr-2 h-4 w-4" />
                创建新绘本
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            我的作品集
          </h1>
          <p className="font-body text-muted-foreground">
            共 {works.length} 部作品
          </p>
        </div>

        {works.length === 0 ? (
          <Card className="border-2 border-dashed border-purple-200 bg-white/60">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-purple-300 mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                还没有作品
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                开始创作你的第一部绘本吧！
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="mr-2 h-4 w-4" />
                  创建绘本
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <Card key={work.id} className="border-2 border-purple-100 bg-white/80 shadow-soft-md backdrop-blur-sm hover:shadow-soft-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-heading text-lg line-clamp-2">
                      {work.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {work.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cover Image or Placeholder */}
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {work.coverImage ? (
                      <img
                        src={work.coverImage}
                        alt={work.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-purple-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {work.ageGroup}岁
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getStyleName(work.style)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(work.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {work.viewCount}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePreview(work.id)}
                    >
                      查看
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(work.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
