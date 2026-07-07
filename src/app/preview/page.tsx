'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, Download, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createLocalPicturebook } from '@/lib/db';
import { getAuthUser } from '@/lib/localAuth';
import { getPDFExportText, getStyleName } from '@/utils/languageDetection';

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

  // 检查登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = getAuthUser();
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('generatedStory');
    if (data) {
      setStoryData(JSON.parse(data));
    }
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

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 封面
      const coverDiv = document.createElement('div');
      coverDiv.style.width = `${pageWidth * 3.78}px`;
      coverDiv.style.height = `${pageHeight * 3.78}px`;
      coverDiv.style.padding = '40px';
      coverDiv.style.backgroundColor = '#F0F4FF';
      coverDiv.style.display = 'flex';
      coverDiv.style.flexDirection = 'column';
      coverDiv.style.alignItems = 'center';
      coverDiv.style.justifyContent = 'center';
      coverDiv.style.fontFamily = 'Arial, sans-serif';

      coverDiv.innerHTML = `
        <div style="text-align: center; color: #6366F1; margin-bottom: 20px;">
          <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 30px;">${storyData.title || pdfText.coverTitle}</h1>
          <p style="font-size: 20px; color: #6B7280; margin: 10px 0;">${pdfText.createdBy}</p>
          <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">${pdfText.ageGroup}：${storyData.ageGroup || (language === 'en' ? '3-5' : '3-5岁')}</p>
          <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">${pdfText.artStyle}：${getStyleName(storyData.style, language)}</p>
        </div>
      `;

      document.body.appendChild(coverDiv);
      const coverCanvas = await html2canvas(coverDiv, { scale: 2, useCORS: true });
      const coverImgData = coverCanvas.toDataURL('image/png');
      pdf.addImage(coverImgData, 'PNG', 0, 0, pageWidth, pageHeight);
      document.body.removeChild(coverDiv);
      pdf.addPage();

      // 内容页
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];

        const pageDiv = document.createElement('div');
        pageDiv.style.width = `${pageWidth * 3.78}px`;
        pageDiv.style.height = `${pageHeight * 3.78}px`;
        pageDiv.style.padding = '30px';
        pageDiv.style.backgroundColor = '#FAFCFC';
        pageDiv.style.display = 'flex';
        pageDiv.style.flexDirection = 'column';
        pageDiv.style.fontFamily = 'Arial, sans-serif';

        const imageUrl = scene.imageUrl || '';
        const imageHtml = imageUrl ? `<img src="${imageUrl}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; background-color: #E5E7EB;" />` : '';

        pageDiv.innerHTML = `
          <div style="flex: 1;">
            <h2 style="color: #6366F1; font-size: 24px; font-weight: bold; margin-bottom: 15px;">${pdfText.scene} ${i + 1}</h2>
            ${imageHtml}
            <div style="margin-bottom: 20px;">
              <p style="color: #6B7280; font-size: 14px; margin-bottom: 8px; font-weight: bold;">${pdfText.sceneDescription}：</p>
              <p style="color: #475569; font-size: 12px; line-height: 1.6;">${scene.description || ''}</p>
            </div>
            ${scene.text ? `
              <div>
                <p style="color: #1E293B; font-size: 14px; margin-bottom: 8px; font-weight: bold;">${pdfText.storyContent}：</p>
                <p style="color: #1E293B; font-size: 13px; line-height: 1.8;">${scene.text}</p>
              </div>
            ` : ''}
          </div>
          <div style="text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px;">${i + 2}</div>
        `;

        document.body.appendChild(pageDiv);
        const pageCanvas = await html2canvas(pageDiv, { scale: 2, useCORS: true });
        const pageImgData = pageCanvas.toDataURL('image/png');
        pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight);
        document.body.removeChild(pageDiv);

        if (i < scenes.length - 1) {
          pdf.addPage();
        }
      }

      // 封底
      const backCoverDiv = document.createElement('div');
      backCoverDiv.style.width = `${pageWidth * 3.78}px`;
      backCoverDiv.style.height = `${pageHeight * 3.78}px`;
      backCoverDiv.style.backgroundColor = '#F0F4FF';
      backCoverDiv.style.display = 'flex';
      backCoverDiv.style.flexDirection = 'column';
      backCoverDiv.style.alignItems = 'center';
      backCoverDiv.style.justifyContent = 'center';
      backCoverDiv.style.fontFamily = 'Arial, sans-serif';

      backCoverDiv.innerHTML = `
        <div style="text-align: center; color: #6366F1;">
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">${pdfText.end}</h1>
          <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">${pdfText.thanks}</p>
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 40px;">${pdfText.copyright}</p>
        </div>
      `;

      document.body.appendChild(backCoverDiv);
      const backCoverCanvas = await html2canvas(backCoverDiv, { scale: 2, useCORS: true });
      const backCoverImgData = backCoverCanvas.toDataURL('image/png');
      pdf.addImage(backCoverImgData, 'PNG', 0, 0, pageWidth, pageHeight);
      document.body.removeChild(backCoverDiv);

      pdf.save(`${storyData.title || (language === 'en' ? 'Picture Book' : '绘本')}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    } finally {
      setExporting(false);
    }
  };

  const handleSave = async () => {
    if (!storyData) return;

    if (!isLoggedIn) {
      alert('请先登录后再保存作品');
      router.push('/login');
      return;
    }

    if (saving) {
      alert('正在保存中，请稍候...');
      return;
    }

    setSaving(true);

    const coverImage = scenes.find((scene: Scene) => scene.imageUrl)?.imageUrl || null;

    const user = getAuthUser();
    if (!user) {
      alert('请先登录后再保存作品');
      router.push('/login');
      setSaving(false);
      return;
    }

    try {
      await createLocalPicturebook({
        userId: user.id,
        title: storyData.title,
        theme: storyData.theme,
        description: storyData.description || storyData.theme,
        ageGroup: storyData.ageGroup,
        style: storyData.style,
        pageCount: scenes.length,
        storyData: {
          scenes,
          characters: storyData.characters || [],
          ...storyData,
        },
        coverImage,
      });

      setSaved(true);
      alert('保存成功！您可以在"我的作品"中查看。');
    } catch (error) {
      console.error('保存失败:', error);
      alert(error instanceof Error ? error.message : '保存失败，请稍后重试');
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
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <div className="text-center">
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
                  {storyData.characters.map((char: any, index: number) => (
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
            © 2025 Seedream Picturebook. 用 AI 点亮孩子的想象力
          </p>
        </div>
      </footer>
    </div>
  );
}