'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface ExampleBook {
  id: string;
  title: string;
  description: string;
  theme: string;
  ageGroup: string;
  style: string;
  coverImage?: string;
  storyData: {
    title: string;
    characters: Array<{ name: string; description: string }>;
    scenes: Array<{
      id: string;
      description: string;
      text: string;
      imageUrl?: string;
    }>;
  };
}

export default function ExamplesPage() {
  const [examples] = useState<ExampleBook[]>([
    {
      id: 'example-1',
      title: '小兔子的森林探险',
      description: '一只勇敢的小兔子在森林中的奇妙冒险，学会了友谊和勇气的力量。',
      theme: '友谊与勇气',
      ageGroup: '3-5',
      style: 'watercolor',
      storyData: {
        title: '小兔子的森林探险',
        characters: [
          { name: '小白', description: '一只可爱的小兔子' },
          { name: '小熊', description: '憨厚的小熊朋友' }
        ],
        scenes: [
          {
            id: 'scene-1',
            description: '阳光明媚的森林里，小白兔子蹦蹦跳跳地出发探险',
            text: '清晨的阳光透过树叶洒下斑驳的光影，小白兔子背着小书包，踏上了探险之旅。',
          },
          {
            id: 'scene-2',
            description: '小白遇到了一只迷路的小熊，决定帮助它找到回家的路',
            text: '森林深处，小白看到了一只哭泣的小熊。原来小熊迷路了，小白决定帮助它。',
          },
          {
            id: 'scene-3',
            description: '小白和小熊一起克服困难，终于找到了小熊的家',
            text: '经过一番努力，小白和小熊终于找到了回家的路。小熊感激地拥抱了小白。',
          },
          {
            id: 'scene-4',
            description: '小白回到家，和妈妈分享今天的冒险经历',
            text: '回到家，小白兴奋地给妈妈讲述了今天的冒险。妈妈夸奖小白是一个勇敢的好孩子。',
          },
        ]
      }
    },
    {
      id: 'example-2',
      title: '神奇的魔法花园',
      description: '小女孩发现了一个隐藏在森林深处的秘密花园，里面有会说话的花朵和精灵。',
      theme: '魔法与奇迹',
      ageGroup: '6-8',
      style: 'anime',
      storyData: {
        title: '神奇的魔法花园',
        characters: [
          { name: '小美', description: '好奇的小女孩' },
          { name: '花精灵', description: '花园的守护者' }
        ],
        scenes: [
          {
            id: 'scene-1',
            description: '小美在森林里发现了一个神秘的门，门上闪烁着魔法的光芒',
            text: '一天，小美在森林里探险时，意外发现了一扇闪着金光的门。门后似乎隐藏着什么秘密。',
          },
          {
            id: 'scene-2',
            description: '小美穿过门，发现了一个美丽的魔法花园，花朵都在唱歌',
            text: '推开金色的门，小美来到了一个神奇的花园。五颜六色的花朵正唱着动听的歌。',
          },
          {
            id: 'scene-3',
            description: '花精灵出现，邀请小美一起守护这个魔法花园',
            text: '美丽的花精灵飞到小美面前，邀请她成为花园的守护者。小美开心地答应了。',
          },
          {
            id: 'scene-4',
            description: '小美学会了用魔法让花园的花朵开得更加美丽',
            text: '在花精灵的帮助下，小美学会了神奇的魔法。花园在她的照顾下变得越来越美丽。',
          },
        ]
      }
    },
    {
      id: 'example-3',
      title: '星空下的约定',
      description: '小松鼠和松鼠妈妈一起看星星，它们约定要一起探索整个森林。',
      theme: '亲情与梦想',
      ageGroup: '3-5',
      style: 'clay',
      storyData: {
        title: '星空下的约定',
        characters: [
          { name: '小松鼠', description: '好奇的小松鼠' },
          { name: '松鼠妈妈', description: '温柔的妈妈' }
        ],
        scenes: [
          {
            id: 'scene-1',
            description: '夜幕降临，小松鼠和妈妈坐在树洞外看星星',
            text: '夜晚的森林很安静，只有萤火虫在飞舞。小松鼠和妈妈一起数着天上的星星。',
          },
          {
            id: 'scene-2',
            description: '妈妈告诉小松鼠每一颗星星都有一个美丽的故事',
            text: '妈妈温柔地给小松鼠讲星星的故事。每一颗星星都有自己独特的光芒和故事。',
          },
          {
            id: 'scene-3',
            description: '小松鼠和妈妈约定，长大后要一起去看更多的星星',
            text: '小松鼠郑重地告诉妈妈，长大后要和妈妈一起去探索更多的星空。',
          },
          {
            id: 'scene-4',
            description: '小松鼠睡着了，梦里它和妈妈一起在星空中飞翔',
            text: '听着妈妈的故事，小松鼠慢慢地睡着了。梦里，它和妈妈一起在璀璨的星空中飞翔。',
          },
        ]
      }
    }
  ]);

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

  const handlePreview = (example: ExampleBook) => {
    // 将示例数据保存到localStorage，然后跳转到预览页面
    localStorage.setItem('generatedStory', JSON.stringify(example.storyData));
    window.location.href = `/preview/${example.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-xl font-heading font-bold text-foreground">示例绘本</span>
            </div>
            <Link href="/create">
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                开始创作
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            精选示例绘本
          </h1>
          <p className="font-body text-muted-foreground">
            浏览AI创作的精美绘本，激发你的创作灵感
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example) => (
            <Card key={example.id} className="border-2 border-purple-100 bg-white/80 shadow-soft-md backdrop-blur-sm hover:shadow-soft-lg transition-all">
              <CardHeader>
                <CardTitle className="font-heading text-lg">{example.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {example.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Placeholder */}
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-purple-400" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs">
                      {example.ageGroup}岁
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getStyleName(example.style)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {example.storyData.scenes.length}页
                    </Badge>
                  </div>
                  <div className="text-xs font-body text-muted-foreground">
                    {example.theme}
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => handlePreview(example)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  预览绘本
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
