/**
 * Utility to compress images client-side into lightweight, persistent Base64 Data URLs.
 * Enables instant cross-tab synchronization and static hosting persistence without relying on ephemeral blob: URLs.
 */
export async function fileToDataUrl(file, maxDimension = 1200, quality = 0.82) {
  if (!file) return '';

  // PDFs are read directly into Data URLs without canvas processing
  if (file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  // Optimize images with Canvas resizing & compression
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(readerEvent.target?.result || '');
        }

        // Fill white background for transparent images converted to jpeg
        const isPng = file.type === 'image/png';
        if (!isPng) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mime = isPng ? 'image/png' : 'image/jpeg';
        try {
          const compressedDataUrl = canvas.toDataURL(mime, quality);
          resolve(compressedDataUrl);
        } catch (e) {
          resolve(readerEvent.target?.result || '');
        }
      };

      img.onerror = () => resolve(readerEvent.target?.result || '');
      img.src = readerEvent.target?.result;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
