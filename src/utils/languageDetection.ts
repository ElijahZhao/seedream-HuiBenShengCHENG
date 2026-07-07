/**
 * 检测文本是英文还是中文
 * @param text 输入文本
 * @returns 'zh' | 'en'
 */
export function detectLanguage(text: string): 'zh' | 'en' {
  if (!text || text.trim() === '') {
    return 'zh'; // 默认中文
  }

  // 统计中文字符数量
  const chineseRegex = /[\u4e00-\u9fa5]/;
  let chineseCount = 0;
  let totalChars = 0;

  for (const char of text) {
    totalChars++;
    if (chineseRegex.test(char)) {
      chineseCount++;
    }
  }

  // 如果中文字符占比超过 30%，则认为是中文
  const chineseRatio = chineseCount / totalChars;
  if (chineseRatio > 0.3) {
    return 'zh';
  }

  return 'en';
}

/**
 * 获取语言的名称
 */
export function getLanguageName(lang: 'zh' | 'en'): string {
  return lang === 'zh' ? '中文' : 'English';
}

/**
 * 获取艺术风格的多语言名称
 */
export function getStyleName(style: string, lang: 'zh' | 'en'): string {
  const styleMap: Record<string, { zh: string; en: string }> = {
    watercolor: { zh: '水彩风', en: 'Watercolor' },
    anime: { zh: '动漫风', en: 'Anime' },
    clay: { zh: '黏土风', en: 'Clay Animation' },
    sketch: { zh: '素描风', en: 'Pencil Sketch' },
    pastel: { zh: '粉彩风', en: 'Pastel' },
    pop: { zh: '波普风', en: 'Pop Art' },
    ukiyoe: { zh: '浮世绘', en: 'Ukiyo-e' },
    oil: { zh: '油画风', en: 'Oil Painting' },
    collage: { zh: '拼贴风', en: 'Collage' },
    pencil: { zh: '彩铅风', en: 'Color Pencil' },
    papercut: { zh: '剪纸风', en: 'Paper Cut' },
    mineral: { zh: '岩彩风', en: 'Mineral Color' },
    vector: { zh: '矢量风', en: 'Vector Art' },
    vintage: { zh: '复古风', en: 'Vintage' },
    flat: { zh: '扁平风', en: 'Flat Design' },
  };

  return styleMap[style]?.[lang] || style;
}

/**
 * 获取PDF导出的多语言文本
 */
export function getPDFExportText(lang: 'zh' | 'en'): Record<string, string> {
  if (lang === 'en') {
    return {
      coverTitle: 'Picture Book Title',
      createdBy: 'Created by Seedream AI',
      ageGroup: 'Recommended Age',
      artStyle: 'Art Style',
      scene: 'Scene',
      sceneDescription: 'Description',
      storyContent: 'Story',
      end: 'The End',
      thanks: 'Thank you for reading',
      copyright: `© ${new Date().getFullYear()} Seedream Picture Book`,
    };
  }

  return {
    coverTitle: '绘本标题',
    createdBy: 'Seedream AI 创作',
    ageGroup: '适读年龄',
    artStyle: '艺术风格',
    scene: '场景',
    sceneDescription: '场景描述',
    storyContent: '故事内容',
    end: '完',
    thanks: '感谢阅读',
    copyright: `© ${new Date().getFullYear()} Seedream 绘本`,
  };
}
