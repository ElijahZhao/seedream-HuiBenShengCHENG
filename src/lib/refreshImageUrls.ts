import { S3Storage, Config } from 'coze-coding-dev-sdk';

interface SceneData {
  imageKey?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface StoryData {
  scenes?: SceneData[];
  [key: string]: unknown;
}

/**
 * 刷新绘本场景图片的签名URL（解决7天过期问题）
 * 仅对有 imageKey 的场景重新生成签名URL
 */
export async function refreshImageUrls(storyData: StoryData): Promise<StoryData> {
  if (!storyData?.scenes?.length) return storyData;

  const hasKeys = storyData.scenes.some(
    (scene) => scene.imageKey && !scene.imageUrl?.startsWith('https://placehold.co')
  );

  if (!hasKeys) return storyData;

  try {
    const config = new Config();
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });

    const refreshedScenes = await Promise.all(
      storyData.scenes.map(async (scene) => {
        if (scene.imageKey && !scene.imageUrl?.startsWith('https://placehold.co')) {
          try {
            const signedUrl = await storage.generatePresignedUrl({
              key: scene.imageKey,
              expireTime: 86400 * 30,
            });
            return { ...scene, imageUrl: signedUrl };
          } catch {
            return scene;
          }
        }
        return scene;
      })
    );

    return { ...storyData, scenes: refreshedScenes };
  } catch (error) {
    console.error('[RefreshImageUrls] Failed to refresh:', error);
    return storyData;
  }
}
