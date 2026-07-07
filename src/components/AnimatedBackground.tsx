'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 动态生成一些装饰元素
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLElement[] = [];

    // 生成漂浮的星星（减少数量到 10 个以提高性能）
    for (let i = 0; i < 10; i++) {
      const star = document.createElement('div');
      star.className = 'absolute text-2xl opacity-60 animate-twinkle';
      star.textContent = '⭐';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 2}s`;
      star.style.willChange = 'opacity, transform';
      container.appendChild(star);
      elements.push(star);
    }

    // 生成可爱的小动物（减少数量到 6 个）
    const animals = ['🐻', '🐰', '🦊', '🐼', '🦄', '🦁'];
    for (let i = 0; i < 6; i++) {
      const animal = document.createElement('div');
      animal.className = 'absolute text-4xl opacity-50 animate-float';
      animal.textContent = animals[i];
      animal.style.left = `${Math.random() * 100}%`;
      animal.style.top = `${Math.random() * 100}%`;
      animal.style.animationDelay = `${Math.random() * 5}s`;
      animal.style.animationDuration = `${4 + Math.random() * 3}s`;
      animal.style.willChange = 'transform';
      container.appendChild(animal);
      elements.push(animal);
    }

    // 生成气球（保持 4 个）
    const balloons = ['🎈', '🎈', '🎈', '🎈'];
    for (let i = 0; i < 4; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'absolute text-3xl opacity-40 animate-rise';
      balloon.textContent = balloons[i];
      balloon.style.left = `${10 + i * 25}%`;
      balloon.style.bottom = '-50px';
      balloon.style.animationDelay = `${i * 2}s`;
      balloon.style.animationDuration = `${8 + Math.random() * 4}s`;
      balloon.style.willChange = 'transform, opacity';
      container.appendChild(balloon);
      elements.push(balloon);
    }

    // 生成花瓣（减少数量到 15 个）
    for (let i = 0; i < 15; i++) {
      const petal = document.createElement('div');
      petal.className = 'absolute text-lg opacity-30 animate-sway';
      petal.textContent = '🌸';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.top = `${Math.random() * 100}%`;
      petal.style.animationDelay = `${Math.random() * 4}s`;
      petal.style.animationDuration = `${5 + Math.random() * 3}s`;
      petal.style.willChange = 'transform';
      container.appendChild(petal);
      elements.push(petal);
    }

    return () => {
      // 清理动态生成的元素
      elements.forEach((element) => {
        if (element.parentNode === container) {
          container.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 云彩层 */}
      <div className="absolute inset-0">
        {/* 大云朵 */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
      </div>

      {/* 动态装饰元素容器 */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-blue-50/20 to-purple-50/30" />
    </div>
  );
}
