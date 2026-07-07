/**
 * 绘本艺术风格配置
 * 集中管理所有风格描述，避免在多个路由中重复定义
 */

export interface StyleConfig {
  id: string;
  zh: string;
  en: string;
}

export const styleConfigs: Record<string, StyleConfig> = {
  watercolor: {
    id: 'watercolor',
    zh: '水彩画风格，柔和的笔触，水彩晕染效果，温暖梦幻',
    en: 'Watercolor style with soft brushstrokes, watercolor blending effect, warm and dreamy',
  },
  anime: {
    id: 'anime',
    zh: '日本动漫风格，精细的线条，鲜艳的色彩，可爱生动',
    en: 'Japanese anime style with fine lines, vibrant colors, cute and lively',
  },
  clay: {
    id: 'clay',
    zh: '黏土动画风格，3D黏土质感，可爱圆润，立体感强',
    en: 'Clay animation style with 3D clay texture, cute and rounded, strong three-dimensional effect',
  },
  sketch: {
    id: 'sketch',
    zh: '铅笔素描风格，细腻的线条，黑白灰层次，艺术感强',
    en: 'Pencil sketch style with delicate lines, black and gray gradations, strong artistic sense',
  },
  pastel: {
    id: 'pastel',
    zh: '粉彩画风格，柔和的粉笔质感，温暖色调，温柔治愈',
    en: 'Pastel style with soft chalk texture, warm tones, gentle and healing',
  },
  pop: {
    id: 'pop',
    zh: '波普艺术风格，大胆的色彩，扁平化设计，活力四射',
    en: 'Pop art style with bold colors, flat design, full of vitality',
  },
  ukiyoe: {
    id: 'ukiyoe',
    zh: '浮世绘风格，传统日式版画，强调线条和色块平涂，色彩艳丽，古典韵味',
    en: 'Ukiyo-e style, traditional Japanese woodblock print, emphasizing lines and flat color blocks, bright colors, classical charm',
  },
  oil: {
    id: 'oil',
    zh: '油画风格，油画质感，色彩丰富，层次分明，厚重质感',
    en: 'Oil painting style with oil texture, rich colors, distinct layers, heavy texture',
  },
  collage: {
    id: 'collage',
    zh: '拼贴风格，层次感拼贴，多种材质叠加，创意十足',
    en: 'Collage style with layered collage, multiple materials overlay, full of creativity',
  },
  pencil: {
    id: 'pencil',
    zh: '彩铅风格，彩铅手绘，清新自然，细腻柔和',
    en: 'Color pencil style with color pencil hand-drawing, fresh and natural, delicate and soft',
  },
  papercut: {
    id: 'papercut',
    zh: '剪纸风格，剪纸艺术，剪纸质感，红色传统元素，镂空效果',
    en: 'Paper cut style, paper cutting art, paper cut texture, red traditional elements, hollow effect',
  },
  mineral: {
    id: 'mineral',
    zh: '岩彩风格，矿物颜料，厚重质感，古典东方韵味',
    en: 'Mineral color style with mineral pigments, heavy texture, classical oriental charm',
  },
  vector: {
    id: 'vector',
    zh: '矢量风格，干净利落，线条清晰，现代简约',
    en: 'Vector style, clean and neat, clear lines, modern and minimalist',
  },
  vintage: {
    id: 'vintage',
    zh: '复古风格，怀旧色调，复古图案，复古质感',
    en: 'Vintage style, nostalgic tones, retro patterns, vintage texture',
  },
  flat: {
    id: 'flat',
    zh: '扁平风格，扁平设计，简洁可爱，色彩明快',
    en: 'Flat style, flat design, simple and cute, bright colors',
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
