'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthUser, clearAuth, restoreSession } from '@/lib/localAuth';

export function Navigation() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      // First try to restore Supabase session (handles page refresh)
      const restored = await restoreSession();
      const authUser = restored || getAuthUser();
      setUserId(authUser?.id || null);
      setUserName(authUser?.name || null);
      setLoading(false);
    };

    const initialLoadTimer = setTimeout(loadUser, 100);

    const handleRouteChange = () => {
      setTimeout(loadUser, 100);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      clearTimeout(initialLoadTimer);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await clearAuth();
      setUserId(null);
      setUserName(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-500 ease-out
        ${isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-clay-md border-b border-purple-200/50'
          : 'bg-transparent border-b border-transparent'
        }
      `}
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105 magnetic"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl
                overflow-hidden
                shadow-clay-md group-hover:shadow-clay-xl group-hover:glow-purple
                transition-all duration-500 hover:-translate-y-1 hover:rotate-3
                ripple-effect"
            >
              <Image src="/icon.png" alt="Seedream" width={48} height={48} className="h-full w-full object-cover group-hover:animate-bounce-soft" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-heading font-bold text-gradient-purple group-hover:animate-gradient">
                绘本自由创作
              </span>
              <span className="hidden sm:block text-xs text-gray-500 font-medium">
                AI驱动的绘本创作平台
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl animate-shimmer" />
            ) : userId ? (
              <>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2
                  bg-white/80 backdrop-blur-sm rounded-2xl
                  shadow-clay-sm hover:shadow-clay-md hover:scale-105 hover-lift
                  transition-all duration-300 cursor-default">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl
                    bg-gradient-to-br from-purple-400 to-pink-400
                    shadow-clay-sm hover:glow-pink transition-all duration-300">
                    <User className="h-5 w-5 text-white animate-pulse-soft" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-heading font-semibold text-gray-800">
                      {userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      创作者
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground
                    hover:bg-purple-100 hover:border-purple-200 hover:shadow-clay-sm
                    transition-all duration-300 rounded-xl hover-lift btn-press ripple-effect"
                >
                  <LogOut className="h-4 w-4 sm:mr-2 group-hover:animate-wiggle" />
                  <span className="hidden sm:inline font-medium">登出</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm sm:text-base font-medium
                      hover:bg-purple-100 hover:border-purple-200 hover:shadow-clay-sm
                      transition-all duration-300 rounded-xl hover-lift btn-press"
                  >
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="text-sm sm:text-base font-semibold
                      btn-gradient-purple text-white btn-enhanced ripple-effect rounded-2xl
                      shadow-clay-sm hover:shadow-clay-md hover:glow-purple hover-lift
                      btn-press transition-all duration-300"
                  >
                    <Sparkles className="h-4 w-4 mr-2 animate-bounce-soft" />
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
