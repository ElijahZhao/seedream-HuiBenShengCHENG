/**
 * Supabase 客户端配置
 * 统一入口，所有 Supabase 操作都通过此文件
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://felyqajdofwipafrkpxb.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHlxYWpkb2Z3aXBhZnJrcHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTM3MTksImV4cCI6MjA5OTA4OTcxOX0.9WNZI4rUOZv10UTSIvGHr1PpJlSK1mqlq67ABi40o1c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
