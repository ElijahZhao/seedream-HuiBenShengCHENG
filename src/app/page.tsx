import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Palette, Zap, Users, ArrowRight, Star, Wand2, CheckCircle2 } from 'lucide-react';
import StyleShowcase from './components/StyleShowcase';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import AutoDiagnostics from '@/components/AutoDiagnostics';
import { getArtStylesForDisplay } from '@/lib/styleConfig';

const artStyles = getArtStylesForDisplay();

const features = [
  {
    icon: <Wand2 className="h-8 w-8" />,
    title: 'AI 故事创作',
    description: '只需输入主题，AI 自动生成完整故事情节、角色设定和分镜设计',
    highlight: true,
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: '多种艺术风格',
    description: '水彩、动漫、黏土、浮世绘、油画等 15 种精美风格，满足不同需求',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: '智能插画生成',
    description: 'AI 为每个场景自动生成高质量插画，细节丰富，风格统一',
    highlight: true,
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: '快速完成',
    description: '从创作到完成，只需几分钟，效率提升 10 倍',
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: '精美预览',
    description: '实时预览绘本效果，支持导出 PDF，分享给亲友',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: '作品管理',
    description: '保存所有作品，随时查看、编辑和分享',
  },
];

const storyChapters = [
  {
    step: '01',
    title: '构思故事',
    description: '输入你的故事主题和描述，AI 帮你生成完整的故事大纲',
    color: 'from-purple-500 to-purple-600',
    items: ['简单描述主题', '设定目标年龄', '选择艺术风格'],
  },
  {
    step: '02',
    title: '智能分镜',
    description: 'AI 自动设计场景分镜，包括画面描述、景别和旁白文字',
    color: 'from-purple-600 to-cyan-500',
    items: ['自动生成分镜', '调整画面细节', '优化叙事节奏'],
  },
  {
    step: '03',
    title: '插画生成',
    description: 'AI 为每个场景生成精美的插画，保持风格一致性',
    color: 'from-cyan-500 to-purple-500',
    items: ['批量生成插画', '实时预览效果', '支持重新生成'],
  },
  {
    step: '04',
    title: '完成分享',
    description: '预览完整的绘本，导出 PDF 或在线分享给亲友',
    color: 'from-purple-500 to-purple-600',
    items: ['精美预览', '导出 PDF', '一键分享'],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Chapter 1: Hero Section - Intro Hook */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20">
        {/* Background Decorations - 滚动触发模式 */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-cyan-300/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 px-5 py-2 text-sm font-semibold hover-lift transition-all">
              <Sparkles className="mr-2 h-4 w-4 animate-bounce-soft" />
              AI 驱动的智能绘本创作平台
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-story-text mb-8 leading-tight">
              让想象力<br/>成为绘本
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-body">
              Seedream 绘本是一款 AI 驱动的智能绘本创作平台。
              通过智能分镜、角色一致性和多风格生成，轻松创作精美绘本。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-2xl shadow-clay-md hover:shadow-clay-xl hover:glow-purple transition-all duration-300 hover-lift"
                >
                  <Sparkles className="mr-2 h-6 w-6 animate-bounce-soft" />
                  开始创作绘本
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/my-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-lg font-semibold border-2 border-purple-200 hover:border-purple-400 rounded-2xl shadow-clay-md hover:shadow-clay-xl transition-all duration-300 hover-lift"
                >
                  <BookOpen className="mr-2 h-6 w-6" />
                  我的创作
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-12 text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500 fill-purple-500" />
                <span>15 种艺术风格</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-cyan-500 fill-cyan-500" />
                <span>AI 智能创作</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500 fill-purple-500" />
                <span>快速生成</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator - 滚动触发模式 */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="w-0.5 h-32 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
          <span className="text-xs text-muted-foreground font-body rotate-90 whitespace-nowrap">滚动探索</span>
        </div>
      </section>

      {/* Chapter 2: Story Journey - Problem to Solution */}
      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-story-text mb-6">
              从灵感到绘本的创作之旅
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
              四步完成你的第一部绘本，AI 全程辅助
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {storyChapters.map((chapter, index) => (
              <div
                key={index}
                className="relative pl-16 lg:pl-20"
              >
                {/* Chapter Number */}
                <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-heading font-bold text-2xl shadow-clay-md hover-lift transition-all">
                  {chapter.step}
                </div>

                <Card className="border-2 border-purple-100 bg-white/90 shadow-clay-md backdrop-blur-sm hover:shadow-clay-lg hover:border-purple-200 transition-all duration-300">
                  <CardHeader className="pb-6">
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="font-heading text-3xl font-bold text-story-text">
                        {chapter.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed font-body">
                      {chapter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {chapter.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Chapter CTA */}
          <div className="mt-16 text-center">
            <Link href="/my-works">
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-2xl shadow-clay-md hover:shadow-clay-xl transition-all duration-300 hover-lift"
              >
                <BookOpen className="mr-2 h-6 w-6" />
                我的创作
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chapter 3: Features - Journey Exploration */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-story-text mb-6">
              强大的功能，简单的创作
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
              一站式 AI 绘本创作平台，从故事到插画，全程智能辅助
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`border-2 ${feature.highlight ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-cyan-50' : 'border-purple-100 bg-white/80'} shadow-clay-md backdrop-blur-sm hover:shadow-clay-lg hover:border-purple-200 transition-all duration-300 hover-lift`}
              >
                <CardHeader>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white mb-6 shadow-clay-sm ${feature.highlight ? 'animate-pulse-soft' : ''}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="font-heading text-xl font-bold text-story-text">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed font-body">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 4: Art Styles - Solution Showcase */}
      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-story-text mb-6">
              多种艺术风格
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
              选择你喜欢的风格，AI 会为你的故事生成对应风格的精美插画
            </p>
          </div>

          <StyleShowcase artStyles={artStyles} />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* 自动诊断（静默运行，结果输出到 console） */}
      <AutoDiagnostics />
    </div>
  );
}
