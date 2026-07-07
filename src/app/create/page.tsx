'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { detectLanguage } from '@/utils/languageDetection';
import { searchStory, generateStoryStream } from '@/lib/volcengine';
import { getStyleDescription } from '@/lib/styleConfig';

const artStyles = [
  { value: 'watercolor', label: '水彩风', description: '柔和的水彩效果，温暖梦幻', gradient: 'from-purple-400 to-purple-500' },
  { value: 'anime', label: '动漫风', description: '日式动漫风格，可爱生动', gradient: 'from-purple-500 to-cyan-400' },
  { value: 'clay', label: '黏土风', description: '3D 黏土风格，立体可爱', gradient: 'from-purple-600 to-purple-400' },
  { value: 'sketch', label: '素描风', description: '铅笔素描风格，艺术感强', gradient: 'from-purple-400 to-purple-600' },
  { value: 'pastel', label: '粉彩风', description: '柔和粉彩，温柔治愈', gradient: 'from-pink-400 to-purple-400' },
  { value: 'pop', label: '波普风', description: '鲜艳色彩，活力四射', gradient: 'from-cyan-400 to-purple-500' },
  { value: 'ukiyoe', label: '浮世绘', description: '传统日式版画，古典韵味', gradient: 'from-red-400 to-pink-500' },
  { value: 'oil', label: '油画风', description: '油画质感，色彩丰富', gradient: 'from-orange-400 to-red-500' },
  { value: 'collage', label: '拼贴风', description: '层次感拼贴，创意十足', gradient: 'from-yellow-400 to-orange-500' },
  { value: 'pencil', label: '彩铅风', description: '彩铅手绘，清新自然', gradient: 'from-green-400 to-teal-500' },
  { value: 'papercut', label: '剪纸风', description: '剪纸艺术，剪纸质感', gradient: 'from-red-500 to-orange-600' },
  { value: 'mineral', label: '岩彩风', description: '矿物颜料，厚重质感', gradient: 'from-amber-400 to-orange-500' },
  { value: 'vector', label: '矢量风', description: '干净利落，现代简约', gradient: 'from-blue-400 to-indigo-500' },
  { value: 'vintage', label: '复古风', description: '怀旧色调，复古风格', gradient: 'from-yellow-600 to-orange-700' },
  { value: 'flat', label: '扁平风', description: '扁平设计，简洁可爱', gradient: 'from-cyan-400 to-blue-500' },
];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchMessage, setSearchMessage] = useState('');
  const [formData, setFormData] = useState({
    theme: '',
    ageGroup: '3-5',
    style: 'watercolor',
    pageCount: 8,
    description: '',
  });

  // 搜索故事主题
  const handleSearch = async () => {
    if (!formData.theme.trim()) {
      alert('请先输入故事主题');
      return;
    }

    setSearching(true);
    setSearchProgress(0);
    setSearchMessage('');

    // 模拟进度条效果
    const progressInterval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const description = await searchStory(formData.theme);

      clearInterval(progressInterval);
      setSearchProgress(100);

      if (description) {
        setFormData({ ...formData, description });
        setSearchMessage('已为您找到相关故事内容，您可以继续编辑或直接使用');
      } else {
        setSearchMessage('未找到相关内容，请尝试其他主题或自己编写故事');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      const errMsg = error instanceof Error ? error.message : '请稍后重试';
      setSearchMessage(`搜索失败：${errMsg}`);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setSearching(false);
        setSearchProgress(0);
      }, 500);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingProgress(0);
    try {
      const detectedLanguage = detectLanguage(formData.theme);

      // 构建 system prompt
      const lang = detectedLanguage || 'zh';
      const styleDesc = getStyleDescription(formData.style, lang);
      const sanitizeInput = (s: string) => s.replace(/ignore previous instructions/gi, '').slice(0, 2000);

      const theme = sanitizeInput(formData.theme);
      const description = sanitizeInput(formData.description);

      const systemPrompt = lang === 'en'
        ? `You are a professional children's picture book author. Create a picture book for ages ${formData.ageGroup}.
Requirements:
1. Complete structure: title, characters, ${formData.pageCount} scenes
2. Simple and age-appropriate
3. Detailed character descriptions for consistent illustration
4. Each scene: shotType, description, text, characters
5. Output MUST be in a JSON code block: \`\`\`json ... \`\`\`
Output format: {"title":"...","characters":[{"name":"...","description":"...","role":"..."}],"scenes":[{"id":"scene-1","shotType":"medium","description":"...","text":"...","characters":["..."]}]}
Style: ${formData.style} - ${styleDesc}`
        : `你是专业的儿童绘本作家。为${formData.ageGroup}岁儿童创作绘本。
要求：
1. 完整结构：标题、角色、${formData.pageCount}个场景
2. 简单易懂
3. 详细的角色描述
4. 每个场景：景别、画面描述、旁白、出场角色
5. 必须放在JSON代码块中：\`\`\`json ... \`\`\`
输出格式：{"title":"...","characters":[{"name":"...","description":"...","role":"..."}],"scenes":[{"id":"scene-1","shotType":"medium","description":"...","text":"...","characters":["..."]}]}
风格：${formData.style} - ${styleDesc}`;

      const userPrompt = lang === 'en'
        ? `Theme: ${theme}\nDescription: ${description}\nOutput in JSON code block.`
        : `主题：${theme}\n描述：${description}\n必须以JSON代码块格式输出。`;

      let fullContent = '';
      const stream = generateStoryStream(systemPrompt, userPrompt);

      for await (const chunk of stream) {
        fullContent += chunk;
        const progress = Math.min(90, Math.round((fullContent.length / 2000) * 100));
        setLoadingProgress(progress);
      }

      // 解析 JSON
      const codeBlockMatch = fullContent.match(/```json\s*([\s\S]*?)```/);
      const genericBlockMatch = fullContent.match(/```\s*([\s\S]*?)```/);
      const firstBrace = fullContent.indexOf('{');
      const lastBrace = fullContent.lastIndexOf('}');

      let storyData = null;
      try {
        const jsonStr = codeBlockMatch?.[1] || genericBlockMatch?.[1]
          || (firstBrace !== -1 && lastBrace > firstBrace ? fullContent.slice(firstBrace, lastBrace + 1) : null);
        if (jsonStr) storyData = JSON.parse(jsonStr);
      } catch {
        storyData = null;
      }

      setLoadingProgress(100);

      if (storyData) {
        localStorage.setItem('generatedStory', JSON.stringify(storyData));
        window.location.href = '/characters';
      } else {
        throw new Error('JSON 解析失败，请重试');
      }
    } catch (error) {
      console.error('生成失败:', error);

      // 尝试获取更详细的错误信息
      let errorMessage = '生成失败，请稍后重试';

      if (error instanceof Error) {
        errorMessage = `生成失败：${error.message}`;
        console.error('[Create Page] Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const isFormValid = formData.theme && formData.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <span className="font-heading font-semibold text-foreground text-sm sm:text-base">创建绘本</span>
            </div>
            <div className="w-16 sm:w-20" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-xs sm:text-sm font-body text-muted-foreground">
            <span>填写故事</span>
            <span>1/4</span>
          </div>
          <Progress value={25} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
              创作故事
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground">
              告诉我们你的想法，我们帮你变成绘本
            </p>
          </div>

          <Card className="border-2 border-purple-100 bg-white/80 shadow-soft-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg sm:text-xl">
                <Sparkles className="h-5 w-5 text-purple-500" />
                故事信息
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                你的故事是什么样子的？
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6">
              {/* 故事主题 */}
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm sm:text-base font-body font-semibold">
                  故事主题 <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="theme"
                    placeholder="例如：小狐狸找月亮、程门立雪、精忠报国"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="h-11 sm:h-12 text-sm sm:text-base flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={!formData.theme.trim() || searching}
                    variant="outline"
                    className="h-11 sm:h-12 px-3 sm:px-4 shrink-0 relative"
                  >
                    {searching ? (
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-purple-500"
                            strokeDasharray={`${searchProgress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    ) : (
                      <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  输入主题，点搜索可自动填充故事内容
                </p>
              </div>

              {/* 故事描述 */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base font-body font-semibold">
                  故事描述
                </Label>
                <Textarea
                  id="description"
                  placeholder="描述你的故事情节，例如：一只橙色的小狐狸想找到天上的月亮，它问过森林里的朋友们，最后在湖里看到了月亮的倒影..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-28 sm:min-h-32 text-sm sm:text-base"
                />
                {searchMessage && (
                  <div className="flex items-start gap-2 rounded-lg bg-purple-50 p-3">
                    <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-purple-700">{searchMessage}</p>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  可选，我们会根据主题自动生成，你也可以自己写
                </p>
              </div>

              {/* 目标年龄 */}
              <div className="space-y-2">
                <Label htmlFor="ageGroup" className="text-sm sm:text-base font-body font-semibold">
                  目标年龄
                </Label>
                <Select value={formData.ageGroup} onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}>
                  <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5岁（学龄前）</SelectItem>
                    <SelectItem value="6-8">6-8岁（小学低年级）</SelectItem>
                    <SelectItem value="9-12">9-12岁（小学高年级）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 艺术风格 */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-body font-semibold">艺术风格</Label>
                <div className="grid gap-2 sm:gap-2.5 grid-cols-2 sm:grid-cols-3">
                  {artStyles.map((style) => (
                    <div
                      key={style.value}
                      className={`cursor-pointer rounded-lg border-2 p-3 sm:p-3.5 transition-all ${
                        formData.style === style.value
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm'
                          : 'border-border bg-white hover:border-purple-300 hover:shadow-sm'
                      }`}
                      onClick={() => setFormData({ ...formData, style: style.value })}
                    >
                      <div className="font-heading font-semibold text-foreground text-sm sm:text-base">
                        {style.label}
                      </div>
                      <div className="mt-0.5 text-xs sm:text-xs font-body text-muted-foreground leading-tight">
                        {style.description}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  选择你喜欢的插画风格，AI 会根据风格调整画面效果
                </p>
              </div>

              {/* 页数 */}
              <div className="space-y-3">
                <Label htmlFor="pageCount" className="text-sm sm:text-base font-body font-semibold">
                  绘本页数 <span className="text-purple-500 font-normal">(4-32页)</span>
                </Label>
                <Input
                  id="pageCount"
                  type="number"
                  min="4"
                  max="32"
                  placeholder="输入页数，如：10"
                  value={formData.pageCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 4 && value <= 32) {
                      setFormData({ ...formData, pageCount: value });
                    }
                  }}
                  className="h-12 sm:h-12 text-base sm:text-base font-semibold border-2 border-purple-200 focus:border-purple-500"
                />
                <div className="pt-1">
                  <p className="text-xs text-muted-foreground mb-2">快速选择推荐值：</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 6, label: '6' },
                      { value: 8, label: '8' },
                      { value: 12, label: '12' },
                      { value: 16, label: '16' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.pageCount === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, pageCount: option.value })}
                        className={formData.pageCount === option.value
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : ""
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  提示：直接在上方输入框输入任意页数（4-32之间）
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || loading}
                className="h-12 sm:h-14 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-base sm:text-lg font-body font-semibold hover:from-purple-600 hover:to-pink-600 relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="relative w-5 h-5">
                      <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white"
                          strokeDasharray={`${loadingProgress}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      </svg>
                    </span>
                    <span>生成中 {loadingProgress}%</span>
                  </div>
                ) : (
                  <>
                    下一步：设计角色
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
