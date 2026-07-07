'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-50 via-white to-purple-50 border-t border-purple-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* 品牌展示 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span className="font-heading text-2xl font-bold text-story-text">Seedream</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              让想象力成为绘本
            </p>
            <p className="text-xs text-muted-foreground">
              AI 驱动的智能绘本创作平台
            </p>
          </div>

          {/* 产品链接 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-story-text">产品</h3>
            <div className="flex flex-wrap gap-4">
              <span className="text-sm text-muted-foreground cursor-default">
                关于我们
              </span>
              <span className="text-sm text-muted-foreground cursor-default">
                使用条款
              </span>
              <span className="text-sm text-muted-foreground cursor-default">
                隐私政策
              </span>
              <span className="text-sm text-muted-foreground cursor-default">
                帮助中心
              </span>
              <Link href="/diagnostics" className="text-sm text-purple-600 hover:text-purple-700">
                故障诊断
              </Link>
            </div>
          </div>

          {/* 社交媒体 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-story-text">关注我们</h3>
            <div className="flex flex-nowrap gap-6">
              {/* 微信公众号 */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative w-24 h-24 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src="/wechat-qrcode.jpg"
                    alt="微信公众号"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-story-text">微信公众号</p>
                  <p className="text-xs text-muted-foreground">gh_61255d005e30</p>
                </div>
              </div>

              {/* 抖音 */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative w-24 h-24 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src="/douyin-qrcode.jpg"
                    alt="抖音"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-story-text">抖音</p>
                  <p className="text-xs text-muted-foreground">ID: 51059042197</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-purple-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Seedream 绘本. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ by Elijah Lin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
