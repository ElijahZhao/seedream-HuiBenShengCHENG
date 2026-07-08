/**
 * 数据库模块
 * 现在基于 Supabase PostgreSQL，支持跨设备同步
 * 接口保持不变，向下兼容
 */

import { supabase } from './supabaseClient';

// ========== 绘本操作 ==========

export async function createLocalPicturebook(data: {
  userId: string;
  title: string;
  theme: string;
  description?: string;
  ageGroup: string;
  style: string;
  pageCount: number;
  storyData: any;
  coverImage?: string;
}) {
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('picturebooks')
    .insert({
      user_id: data.userId,
      title: data.title,
      theme: data.theme,
      description: data.description || '',
      age_group: data.ageGroup,
      style: data.style,
      page_count: data.pageCount,
      story_data: data.storyData,
      cover_image: data.coverImage || '',
      is_published: false,
      view_count: 0,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    theme: row.theme,
    description: row.description,
    ageGroup: row.age_group,
    style: row.style,
    pageCount: row.page_count,
    storyData: row.story_data,
    coverImage: row.cover_image,
    isPublished: row.is_published,
    viewCount: row.view_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getLocalPicturebooks(userId: string) {
  const { data, error } = await supabase
    .from('picturebooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    theme: row.theme,
    description: row.description,
    ageGroup: row.age_group,
    style: row.style,
    pageCount: row.page_count,
    storyData: row.story_data,
    coverImage: row.cover_image,
    isPublished: row.is_published,
    viewCount: row.view_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function getLocalPicturebookById(id: string) {
  const { data: row, error } = await supabase
    .from('picturebooks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    theme: row.theme,
    description: row.description,
    ageGroup: row.age_group,
    style: row.style,
    pageCount: row.page_count,
    storyData: row.story_data,
    coverImage: row.cover_image,
    isPublished: row.is_published,
    viewCount: row.view_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function updateLocalPicturebook(id: string, data: any) {
  const updatePayload: any = { updated_at: new Date().toISOString() };

  // 映射 camelCase → snake_case
  const fieldMap: Record<string, string> = {
    title: 'title',
    theme: 'theme',
    description: 'description',
    ageGroup: 'age_group',
    style: 'style',
    pageCount: 'page_count',
    storyData: 'story_data',
    coverImage: 'cover_image',
    isPublished: 'is_published',
    viewCount: 'view_count',
  };

  for (const [camelKey, snakeKey] of Object.entries(fieldMap)) {
    if (data[camelKey] !== undefined) {
      updatePayload[snakeKey] = data[camelKey];
    }
  }

  const { error } = await supabase
    .from('picturebooks')
    .update(updatePayload)
    .eq('id', id);

  if (error) throw new Error(error.message);

  return getLocalPicturebookById(id);
}

export async function deleteLocalPicturebook(id: string) {
  const { error } = await supabase
    .from('picturebooks')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
