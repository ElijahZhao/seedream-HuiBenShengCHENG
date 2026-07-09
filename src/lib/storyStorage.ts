import { getStorage } from './storage';

const STORY_KEY = 'generatedStory';

export async function loadStory(): Promise<string | null> {
  const storage = await getStorage();
  return storage.load(STORY_KEY);
}

export async function saveStory(data: string): Promise<void> {
  const storage = await getStorage();
  return storage.save(STORY_KEY, data);
}

export async function removeStory(): Promise<void> {
  const storage = await getStorage();
  return storage.remove(STORY_KEY);
}
