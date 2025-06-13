interface AssetLoaderOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

// List of game assets to preload
export const gameAssets = [
  '/images/adventurer.png',
  '/images/beast.png',
  '/images/game.png',
  // Add more assets as needed
];

export const preloadAssets = async (assets: string[], options: AssetLoaderOptions = {}) => {
  const { onProgress, onComplete } = options;
  const total = assets.length;
  let loaded = 0;

  const loadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (onProgress) {
          onProgress(loaded / total);
        }
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  try {
    await Promise.all(assets.map(loadImage));
    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    console.error('Error preloading assets:', error);
  }
};

export function prefetchStream(uid: string) {
  if (!uid) return;

  const manifest = `https://customer-z4845v01tb3yh1uw.cloudflarestream.com/${uid}/manifest/video.m3u8`;
  fetch(manifest, { mode: 'no-cors', credentials: 'omit', priority: 'low' });
}