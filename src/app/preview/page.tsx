'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, Download, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { createLocalPicturebook } from '@/lib/db';
import { getAuthUser, restoreSession } from '@/lib/localAuth';
import { getPDFExportText, getStyleName } from '@/utils/languageDetection';
import { toast } from 'sonner';
import { loadStory } from '@/lib/storyStorage';

interface Scene {
  id: string;
  shotType: string;
  description: string;
  text: string;
  imageUrl?: string | null;
}

export default function PreviewPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查登录状态（一次性）
  useEffect(() => {
    const user = getAuthUser();
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    (async () => {
        const data = await loadStory();
        if (data) {
          setStoryData(JSON.parse(data));
        }
    })();
}, []);

  const scenes = storyData?.scenes || [];
  const totalPages = scenes.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExport = async () => {
    if (!storyData) return;

    setExporting(true);
    try {
      const language = (storyData.language as 'zh' | 'en') || 'zh';
      const pdfText = getPDFExportText(language);

      // 获取当前用户信息
      const authUser = getAuthUser();
      const authorName = authUser?.name || (language === 'en' ? 'Anonymous' : '匿名用户');
      const styleName = getStyleName(storyData.style || 'watercolor', language);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();  // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Load Chinese font for CJK support
      console.log('加载中文字体...');
      const fontResponse = await fetch('/fonts/NotoSansSC-Regular.ttf');
      if (!fontResponse.ok) {
        throw new Error(`字体加载失败: ${fontResponse.status} ${fontResponse.statusText}`);
      }
      const fontBlob = await fontResponse.blob();

      // Use FileReader for safe base64 encoding of large binary files
      const fontBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('字体文件读取失败'));
        reader.readAsDataURL(fontBlob);
      });

      pdf.addFileToVFS('NotoSansSC-Regular.ttf', fontBase64);
      pdf.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
      pdf.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'bold');

      // 预加载图片为 base64
      const preloadImage = async (url: string): Promise<string> => {
        if (!url) return '';

        // 如果已经是 base64 data URL，直接返回
        if (url.startsWith('data:')) {
          console.log('[PDF] 图片已是base64格式，直接使用');
          return url;
        }

        // 方法1: 直接 fetch（如果 CDN 支持 CORS）
        try {
          const resp = await fetch(url, { mode: 'cors' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const blob = await resp.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('FileReader失败'));
            reader.readAsDataURL(blob);
          });
          console.log('[PDF] 直接fetch图片成功');
          return dataUrl;
        } catch (fetchErr) {
          console.warn('[PDF] 直接fetch失败，尝试CORS代理:', fetchErr);
        }

        // 方法2: 通过 CORS 代理获取
        try {
          const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
          const proxyResp = await fetch(proxyUrl);
          if (!proxyResp.ok) throw new Error(`Proxy HTTP ${proxyResp.status}`);
          const blob = await proxyResp.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('代理FileReader失败'));
            reader.readAsDataURL(blob);
          });
          console.log('[PDF] CORS代理获取图片成功');
          return dataUrl;
        } catch (proxyErr) {
          console.error('[PDF] CORS代理也失败:', proxyErr);
        }

        // 方法3: Image + Canvas（最后手段，可能因CORS污染失败）
        return new Promise<string>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || 800;
              canvas.height = img.naturalHeight || 600;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(''); return; }
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/jpeg', 0.92));
            } catch {
              console.error('[PDF] Canvas转换失败（CORS污染）');
              resolve('');
            }
          };
          img.onerror = () => {
            console.error('[PDF] 图片加载完全失败');
            resolve('');
          };
          img.src = url;
        });
      };

      const sceneImageBase64: string[] = [];
      for (let i = 0; i < scenes.length; i++) {
        const base64 = await preloadImage(scenes[i].imageUrl || '');
        sceneImageBase64.push(base64);
        console.log(`[PDF] 场景${i + 1}图片加载:`, base64 ? (base64.startsWith('data:') ? '成功(base64)' : '失败(非base64)') : '空');
      }

      // 辅助：绘制背景色块
      const drawBg = (color: string) => {
        pdf.setFillColor(color);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      };

      // 辅助：文本自动换行
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, align: 'left' | 'center' = 'left') => {
        const splitText = pdf.splitTextToSize(text, maxWidth);
        if (align === 'center') {
          splitText.forEach((line: string) => {
            const textWidth = pdf.getTextWidth(line);
            pdf.text(line, x + (maxWidth - textWidth) / 2, y);
            y += lineHeight;
          });
        } else {
          pdf.text(splitText, x, y);
          y += splitText.length * lineHeight;
        }
        return y;
      };

      // ===== 封面 =====
      drawBg('#F0F4FF');
      pdf.setTextColor(99, 102, 241); // #6366F1
      pdf.setFontSize(28);
      pdf.setFont('NotoSansSC', 'bold');
      const title = storyData.title || pdfText.coverTitle;
      addWrappedText(title, margin, 100, contentWidth, 10, 'center');

      pdf.setFontSize(14);
      pdf.setFont('NotoSansSC', 'normal');
      pdf.setTextColor(107, 114, 128); // #6B7280
      pdf.text(`${language === 'en' ? 'Created by' : '作者'}：${authorName}`, pageWidth / 2, 140, { align: 'center' });
      pdf.text(`${pdfText.ageGroup}：${storyData.ageGroup || (language === 'en' ? '3-5' : '3-5岁')}`, pageWidth / 2, 152, { align: 'center' });
      pdf.text(`${pdfText.artStyle}：${styleName}`, pageWidth / 2, 164, { align: 'center' });

      pdf.addPage();

      // ===== 内容页 =====
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const imgBase64 = sceneImageBase64[i];

        drawBg('#FAFCFC');

        // 页眉：场景标题
        pdf.setTextColor(99, 102, 241);
        pdf.setFontSize(18);
        pdf.setFont('NotoSansSC', 'bold');
        pdf.text(`${pdfText.scene} ${i + 1}`, margin, 25);

        let y = 32;

        // 图片区域
        if (imgBase64 && imgBase64.startsWith('data:')) {
          try {
            const imgHeight = 70;
            // Auto-detect image format from data URL
            const getImageFormat = (dataUrl: string): string => {
              if (dataUrl.includes('image/png')) return 'PNG';
              if (dataUrl.includes('image/jpeg') || dataUrl.includes('image/jpg')) return 'JPEG';
              if (dataUrl.includes('image/webp')) return 'WEBP';
              if (dataUrl.includes('image/gif')) return 'GIF';
              return 'JPEG';
            };
            const imgFormat = getImageFormat(imgBase64);
            pdf.addImage(imgBase64, imgFormat, margin, y, contentWidth, imgHeight, undefined, 'FAST');
            y += imgHeight + 8;
          } catch {
            pdf.setFillColor(229, 231, 235);
            pdf.rect(margin, y, contentWidth, 70, 'F');
            pdf.setTextColor(156, 163, 175);
            pdf.setFontSize(12);
            pdf.text(language === 'en' ? 'No Image' : '暂无图片', pageWidth / 2, y + 40, { align: 'center' });
            y += 78;
          }
        } else {
          pdf.setFillColor(229, 231, 235);
          pdf.rect(margin, y, contentWidth, 70, 'F');
          pdf.setTextColor(156, 163, 175);
          pdf.setFontSize(12);
          pdf.text(language === 'en' ? 'No Image' : '暂无图片', pageWidth / 2, y + 40, { align: 'center' });
          y += 78;
        }

        // 场景描述
        if (scene.description) {
          pdf.setTextColor(107, 114, 128);
          pdf.setFontSize(11);
          pdf.setFont('NotoSansSC', 'bold');
          pdf.text(`${pdfText.sceneDescription}：`, margin, y);
          y += 5;

          pdf.setTextColor(71, 85, 105);
          pdf.setFont('NotoSansSC', 'normal');
          pdf.setFontSize(10);
          y = addWrappedText(scene.description, margin, y, contentWidth, 4.5);
          y += 6;
        }

        // 故事文本
        if (scene.text) {
          pdf.setTextColor(30, 41, 59);
          pdf.setFontSize(11);
          pdf.setFont('NotoSansSC', 'bold');
          pdf.text(`${pdfText.storyContent}：`, margin, y);
          y += 5;

          pdf.setFont('NotoSansSC', 'normal');
          pdf.setFontSize(10.5);
          y = addWrappedText(scene.text, margin, y, contentWidth, 5);
        }

        // 页码
        pdf.setTextColor(156, 163, 175);
        pdf.setFontSize(10);
        pdf.text(String(i + 2), pageWidth / 2, pageHeight - 10, { align: 'center' });

        if (i < scenes.length - 1) {
          pdf.addPage();
        }
      }

      // ===== 封底 =====
      pdf.addPage();
      drawBg('#F0F4FF');
      pdf.setTextColor(99, 102, 241);
      pdf.setFontSize(24);
      pdf.setFont('NotoSansSC', 'bold');
      pdf.text(pdfText.end, pageWidth / 2, 120, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('NotoSansSC', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text(pdfText.thanks, pageWidth / 2, 140, { align: 'center' });

      pdf.setFontSize(9);
      pdf.setTextColor(156, 163, 175);
      pdf.text(pdfText.copyright, pageWidth / 2, 260, { align: 'center' });

      pdf.save(`${storyData.title || (language === 'en' ? 'Picture Book' : '绘本')}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('导出失败:', error);
      const errMsg = error instanceof Error ? error.message : '未知错误';
      toast.error(`导出失败：${errMsg}`);
    } finally {
      setExporting(false);
    }
  };

  const handleSave = async () => {
    if (!storyData) return;
    if (saving) return;

    setSaving(true);

    const coverImage = scenes.find((scene: Scene) => scene.imageUrl)?.imageUrl || null;

    // 确保恢复 Supabase session
    const restored = await restoreSession();
    const user = restored || getAuthUser();
    if (!user) {
      router.push('/login');
      setSaving(false);
      return;
    }

    try {
      await createLocalPicturebook({
        userId: user.id,
        title: storyData.title || '未命名绘本',
        theme: storyData.theme || '',
        description: storyData.description || storyData.theme || '',
        ageGroup: storyData.ageGroup || '3-5',
        style: storyData.style || 'watercolor',
        pageCount: scenes.length,
        storyData: {
          scenes,
          characters: storyData.characters || [],
          ...storyData,
        },
        coverImage,
      });

      setSaved(true);
      toast.success('保存成功！您可以在"我的作品"中查看。');
    } catch (error) {
      console.error('保存失败:', error);
      const errMsg = error instanceof Error ? error.message : '保存失败，请稍后重试';
      toast.error(`保存失败：${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const currentScene = scenes[currentPage];

  if (!storyData || !currentScene) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <div className="hidden text-center sm:block">
              <h1 className="font-heading text-xl font-bold text-foreground">
                {storyData.title}
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Seedream AI 绘本
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={saved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saved ? '已保存' : '保存作品'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                导出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Book Viewer */}
          <div className="mb-8">
            <Card className="border-4 border-white bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left Page */}
                  {currentPage > 0 && (
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-inner">
                      <div className="flex h-full flex-col">
                        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg">
                          {scenes[currentPage - 1].imageUrl ? (
                            <img
                              src={scenes[currentPage - 1].imageUrl}
                              alt={`场景 ${currentPage}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="mb-4 inline-block rounded-full bg-purple-100 p-4">
                                <span className="text-4xl">🎨</span>
                              </div>
                              <p className="font-heading text-lg font-semibold text-purple-700">
                                场景 {currentPage}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-3">
                          <p className="font-body text-base font-semibold text-purple-800 px-2 leading-relaxed">
                            {scenes[currentPage - 1].text}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-2">
                            {currentPage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Page */}
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-pink-50 to-orange-50 p-4 shadow-inner">
                    <div className="flex h-full flex-col">
                      <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg">
                        {currentScene.imageUrl ? (
                          <img
                            src={currentScene.imageUrl}
                            alt={`场景 ${currentPage + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mb-4 inline-block rounded-full bg-pink-100 p-4">
                              <span className="text-4xl">✨</span>
                            </div>
                            <p className="font-heading text-lg font-semibold text-pink-700">
                              场景 {currentPage + 1}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-center mt-3">
                        <p className="font-body text-base font-semibold text-pink-800 px-2 leading-relaxed">
                          {currentScene.text}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-2">
                          {currentPage + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="border-2 border-purple-100 bg-white/80 shadow-soft-md backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                variant="outline"
                size="lg"
                className="h-12"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                上一页
              </Button>

              <div className="flex flex-col items-center">
                <span className="font-heading text-lg font-semibold text-foreground">
                  {currentPage + 1} / {totalPages}
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  {currentPage === 0 ? '封面' : currentPage === totalPages - 1 ? '封底' : '故事'}
                </span>
              </div>

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                size="lg"
                className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                下一页
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Story Info */}
          <div className="mt-8 text-center">
            <Card className="border-2 border-pink-100 bg-white/80 shadow-soft-md backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                  {storyData.title}
                </h2>
                <p className="mb-4 font-body text-muted-foreground">
                  由 Seedream AI 创作
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(storyData.characters || []).map((char: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-body font-semibold text-purple-700"
                    >
                      {char.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-body text-muted-foreground">
            © {new Date().getFullYear()} Seedream Picturebook. 用 AI 点亮孩子的想象力
          </p>
        </div>
      </footer>
    </div>
  );
}
