'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExampleBook {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  style: string;
  storyData: any;
}

const EXAMPLES: ExampleBook[] = [
  {
    id: 'example-1',
    title: '小兔子的冒险',
    description: '一只勇敢的小兔子探索森林的故事',
    ageGroup: '3-5',
    style: '清新水彩',
    storyData: {
      title: '小兔子的冒险',
      theme: '小兔子的冒险',
      language: 'zh',
      ageGroup: '3-5',
      style: '清新水彩',
      scenes: [
        {
          id: 'scene-1',
          shotType: '广角镜头',
          description: '清晨的森林，阳光透过树叶洒下金色的光芒，一只白色的毛绒绒的小兔子从树洞里探出头来，眼睛闪闪发亮。',
          text: '清晨，小兔子跳跳从树洞里醒来，阳光洒在它柔软的毛发上。"今天要去哪里玩呢？"它兴奋地想。',
          imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800'
        },
        {
          id: 'scene-2',
          shotType: '中景',
          description: '小兔子在花丛中蹦蹦跳跳，周围开满了五颜六色的野花，蝴蝶在花间飞舞。',
          text: '跳跳蹦蹦跳跳地跑进了一片花海。红的、黄的、紫的野花在微风中轻轻摇摆，蝴蝶在花丛中翩翩起舞。',
          imageUrl: 'https://images.unsplash.com/photo-1518495973-0bac4b7c4b0d?w=800'
        },
        {
          id: 'scene-3',
          shotType: '全景',
          description: '小兔子来到一条小溪边，清澈的溪水在阳光下闪闪发光，小鱼在水里游来游去。',
          text: '穿过花海，跳跳来到了一条清澈的小溪边。溪水叮咚作响，像在唱歌。几条小鱼在溪水里快乐地游着。',
          imageUrl: 'https://images.unsplash.com/photo-1588953936175-7aa27c1e09a4?w=800'
        }
      ],
      characters: [
        { name: '小兔子跳跳', role: '主角' }
      ]
    }
  },
  {
    id: 'example-2',
    title: '彩虹下的心愿',
    description: '小女孩寻找彩虹尽头宝藏的奇妙旅程',
    ageGroup: '4-6',
    style: '宫崎骏风格',
    storyData: {
      title: '彩虹下的心愿',
      theme: '彩虹下的心愿',
      language: 'zh',
      ageGroup: '4-6',
      style: '宫崎骏风格',
      scenes: [
        {
          id: 'scene-1',
          shotType: '远景',
          description: '雨后的天空中出现了一道绚丽的彩虹，一个小女孩站在草地上，仰头望着彩虹，眼睛里充满憧憬。',
          text: '雨停了。小美推开窗户，一道七彩的彩虹横跨天空。"好美啊！"她听说彩虹的尽头藏着神秘的宝藏，决定去寻找。',
          imageUrl: 'https://images.unsplash.com/photo-1496450681664-3df85efbd29f?w=800'
        },
        {
          id: 'scene-2',
          shotType: '中景',
          description: '小女孩穿过一片开满向日葵的田野，金色的向日葵朝着太阳微笑，小蝴蝶在前面带路。',
          text: '小美穿过一片金色的向日葵田野。向日葵们朝着她微笑，一只蓝色的小蝴蝶在她前面飞着，像是在为她带路。',
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
        },
        {
          id: 'scene-3',
          shotType: '特写',
          description: '在彩虹的尽头，小女孩发现了一个闪闪发光的宝箱，打开后发现里面装满了萤火虫。',
          text: '在彩虹的尽头，小美发现了一个小箱子。她轻轻打开，里面飞出了无数萤火虫，像星星一样照亮了整个夜空。',
          imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'
        }
      ],
      characters: [
        { name: '小美', role: '主角' }
      ]
    }
  },
  {
    id: 'example-3',
    title: '会说话的星星',
    description: '一颗流星坠落地球，和小男孩成为好朋友的温暖故事',
    ageGroup: '3-5',
    style: '温暖卡通',
    storyData: {
      title: '会说话的星星',
      theme: '会说话的星星',
      language: 'zh',
      ageGroup: '3-5',
      style: '温暖卡通',
      scenes: [
        {
          id: 'scene-1',
          shotType: '广角镜头',
          description: '夜晚的屋顶上，一个小男孩用望远镜看星星，突然一颗流星划过天际，落在不远处的森林里。',
          text: '晚上，小宇在屋顶上看星星。"哇！"一颗闪闪发光的流星划过天际，掉进了旁边的森林里。他赶紧跑去找。',
          imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'
        },
        {
          id: 'scene-2',
          shotType: '中景',
          description: '小男孩在森林里找到了一颗发着柔和蓝光的小星星，星星会说话！它们开心地聊天。',
          text: '在森林里，小宇找到了一颗发着蓝光的小星星。"你好，我叫闪闪！"星星居然会说话！它们成了好朋友。',
          imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800'
        },
        {
          id: 'scene-3',
          shotType: '全景',
          description: '小男孩把星星带回家，星星照亮了整个房间，他们还一起在星空下跳舞。',
          text: '小宇把闪闪带回家。星星把整个房间照得亮堂堂的，它们在月光下一起跳舞，笑声传得很远很远。',
          imageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800'
        }
      ],
      characters: [
        { name: '小宇', role: '主角' },
        { name: '闪闪（星星）', role: '好朋友' }
      ]
    }
  }
];

const styleMap: Record<string, string> = {
  '清新水彩': '清新水彩',
  '宫崎骏风格': '宫崎骏风格',
  '温暖卡通': '温暖卡通'
};

export default function ExamplesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const getStyleName = (style: string) => {
    return styleMap[style] || style;
  };

  const handlePreview = (example: ExampleBook) => {
    // 将示例数据保存到localStorage，然后跳转到预览页面
    localStorage.setItem('generatedStory', JSON.stringify(example.storyData));
    router.push('/preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← 返回首页
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                示例绘本
              </h1>
              <p className="font-body text-muted-foreground">
                看看 AI 能创作出什么样的故事
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((example) => (
              <Card
                key={example.id}
                className="group overflow-hidden border-2 border-purple-100 bg-white/80 shadow-soft-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-soft-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    {example.storyData.scenes[0].imageUrl ? (
                      <img
                        src={example.storyData.scenes[0].imageUrl}
                        alt={example.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-6xl">📖</span>
                      </div>
                    )}
                  </div>

                  <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                    {example.title}
                  </h2>
                  <p className="mb-4 font-body text-sm text-muted-foreground">
                    {example.description}
                  </p>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      {example.ageGroup}岁
                    </span>
                    <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-700">
                      {getStyleName(example.style)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setLoading(example.id);
                      handlePreview(example);
                    }}
                    disabled={loading === example.id}
                  >
                    {loading === example.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    预览绘本
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}