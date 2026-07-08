/**
 * 绘本艺术风格配置
 * 集中管理所有风格描述，避免在多个路由中重复定义
 */

export interface StyleConfig {
  id: string;
  zh: string;
  en: string;
  gradient: string;
}

export const styleConfigs: Record<string, StyleConfig> = {
  watercolor: {
    id: 'watercolor',
    zh: '水彩画风格，柔和的笔触，水彩晕染效果，温暖梦幻',
    en: 'Watercolor style with soft brushstrokes, watercolor blending effect, warm and dreamy',
    gradient: 'from-purple-400 to-purple-500',
  },
  anime: {
    id: 'anime',
    zh: '日本动漫风格，精细的线条，鲜艳的色彩，可爱生动',
    en: 'Japanese anime style with fine lines, vibrant colors, cute and lively',
    gradient: 'from-purple-500 to-cyan-400',
  },
  clay: {
    id: 'clay',
    zh: '黏土动画风格，3D黏土质感，可爱圆润，立体感强',
    en: 'Clay animation style with 3D clay texture, cute and rounded, strong three-dimensional effect',
    gradient: 'from-purple-600 to-purple-400',
  },
  sketch: {
    id: 'sketch',
    zh: '铅笔素描风格，细腻的线条，黑白灰层次，艺术感强',
    en: 'Pencil sketch style with delicate lines, black and gray gradations, strong artistic sense',
    gradient: 'from-purple-400 to-purple-600',
  },
  pastel: {
    id: 'pastel',
    zh: '粉彩画风格，柔和的粉笔质感，温暖色调，温柔治愈',
    en: 'Pastel style with soft chalk texture, warm tones, gentle and healing',
    gradient: 'from-pink-400 to-purple-400',
  },
  pop: {
    id: 'pop',
    zh: '波普艺术风格，大胆的色彩，扁平化设计，活力四射',
    en: 'Pop art style with bold colors, flat design, full of vitality',
    gradient: 'from-cyan-400 to-purple-500',
  },
  ukiyoe: {
    id: 'ukiyoe',
    zh: '浮世绘风格，传统日式版画，强调线条和色块平涂，色彩艳丽，古典韵味',
    en: 'Ukiyo-e style, traditional Japanese woodblock print, emphasizing lines and flat color blocks, bright colors, classical charm',
    gradient: 'from-red-400 to-pink-500',
  },
  oil: {
    id: 'oil',
    zh: '油画风格，油画质感，色彩丰富，层次分明，厚重质感',
    en: 'Oil painting style with oil texture, rich colors, distinct layers, heavy texture',
    gradient: 'from-orange-400 to-red-500',
  },
  collage: {
    id: 'collage',
    zh: '拼贴风格，层次感拼贴，多种材质叠加，创意十足',
    en: 'Collage style with layered collage, multiple materials overlay, full of creativity',
    gradient: 'from-yellow-400 to-orange-500',
  },
  pencil: {
    id: 'pencil',
    zh: '彩铅风格，彩铅手绘，清新自然，细腻柔和',
    en: 'Color pencil style with color pencil hand-drawing, fresh and natural, delicate and soft',
    gradient: 'from-green-400 to-teal-500',
  },
  papercut: {
    id: 'papercut',
    zh: '剪纸风格，剪纸艺术，剪纸质感，红色传统元素，镂空效果',
    en: 'Paper cut style, paper cutting art, paper cut texture, red traditional elements, hollow effect',
    gradient: 'from-red-500 to-orange-600',
  },
  mineral: {
    id: 'mineral',
    zh: '岩彩风格，矿物颜料，厚重质感，古典东方韵味',
    en: 'Mineral color style with mineral pigments, heavy texture, classical oriental charm',
    gradient: 'from-amber-400 to-orange-500',
  },
  vector: {
    id: 'vector',
    zh: '矢量风格，干净利落，线条清晰，现代简约',
    en: 'Vector style, clean and neat, clear lines, modern and minimalist',
    gradient: 'from-blue-400 to-indigo-500',
  },
  vintage: {
    id: 'vintage',
    zh: '复古风格，怀旧色调，复古图案，复古质感',
    en: 'Vintage style, nostalgic tones, retro patterns, vintage texture',
    gradient: 'from-yellow-600 to-orange-700',
  },
  flat: {
    id: 'flat',
    zh: '扁平风格，扁平设计，简洁可爱，色彩明快',
    en: 'Flat style, flat design, simple and cute, bright colors',
    gradient: 'from-cyan-400 to-blue-500',
  },
};

/**
 * 获取指定语言的风格描述
 */
export function getStyleDescription(style: string, lang: 'zh' | 'en'): string {
  return styleConfigs[style]?.[lang]
    || (lang === 'en' ? 'Picture book illustration style with bright colors, suitable for children'
                       : '绘本插画风格，色彩明亮，适合儿童');
}

/**
 * 获取中文风格描述（用于图片生成 prompt）
 */
export function getStylePrompt(style: string): string {
  return styleConfigs[style]?.zh
    || '绘本插画风格，色彩明亮，适合儿童';
}

/**
 * 获取所有风格 ID 列表
 */
export function getStyleIds(): string[] {
  return Object.keys(styleConfigs);
}

/**
 * 获取用于显示的艺术风格列表（包含 label、description、gradient）
 */
export function getArtStylesForDisplay(): Array<{ value: string; label: string; description: string; gradient: string }> {
  return Object.entries(styleConfigs).map(([id, config]) => ({
    value: id,
    label: config.zh.split('，')[0],
    description: config.zh.split('，').slice(1).join('，') || config.zh,
    gradient: config.gradient,
  }));
}
