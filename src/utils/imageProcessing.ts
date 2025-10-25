/**
 * Resize and crop image to exact dimensions (1280x720px) for video generation
 */
export const resizeImageTo1280x720 = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      const targetWidth = 1280;
      const targetHeight = 720;
      const targetAspect = targetWidth / targetHeight;
      const imageAspect = img.width / img.height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageAspect > targetAspect) {
        // Image is wider than target - fit height and crop width
        drawHeight = targetHeight;
        drawWidth = img.width * (targetHeight / img.height);
        offsetX = (targetWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller than target - fit width and crop height
        drawWidth = targetWidth;
        drawHeight = img.height * (targetWidth / img.width);
        offsetX = 0;
        offsetY = (targetHeight - drawHeight) / 2;
      }

      // Draw image centered and cropped
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};
