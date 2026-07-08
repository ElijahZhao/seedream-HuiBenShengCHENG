'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { styleExampleImages } from '@/config/styleImages';

interface ArtStyle {
  value: string;
  label: string;
  description: string;
  gradient: string;
}

interface StyleShowcaseProps {
  artStyles: ArtStyle[];
}

export default function StyleShowcase({ artStyles }: StyleShowcaseProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {artStyles.map((style) => (
        <Card
          key={style.value}
          onClick={() => setExpanded(expanded === style.value ? null : style.value)}
          className="border-2 border-purple-100 bg-white/80 shadow-clay-md backdrop-blur-sm hover:shadow-clay-lg transition-all duration-300 hover-lift cursor-pointer group overflow-hidden"
        >
          <CardHeader>
            <div
              className={`h-48 rounded-xl mb-6 flex items-center justify-center shadow-clay-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden relative`}
            >
              {styleExampleImages[style.value] ? (
                <img
                  src={styleExampleImages[style.value]}
                  alt={style.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                  <Palette className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="font-heading text-xl font-bold text-story-text">{style.label}</CardTitle>
            <CardDescription className="text-base font-body">
              {style.description}
            </CardDescription>
            {expanded === style.value && (
              <div className="mt-3 pt-3 border-t border-purple-100 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="font-body">点击选择此风格，系统将使用 {style.label} 为您生成绘本插画。</p>
              </div>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
