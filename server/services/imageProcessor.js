import { generate as generateWithDalle } from './imageGen.js';
import { uploadFromUrl } from './cloudinary.js';
import { log, LogType } from './debugLog.js';

/**
 * Process a list of image requests - either URLs or AI generation requests
 * Returns an array of { originalRef, permanentUrl, placement }
 */
export async function processImages(images) {
  if (!images || images.length === 0) {
    log(LogType.INFO, 'No images to process');
    return [];
  }

  log(LogType.INFO, `Starting image processing`, { count: images.length });

  const results = await Promise.all(
    images.map(async (img, index) => {
      try {
        if (img.type === 'url') {
          // Existing URL - upload to Cloudinary for optimization and permanence
          log(LogType.INFO, `Processing URL image ${index + 1}`, { url: img.url?.substring(0, 50) });
          const permanentUrl = await uploadFromUrl(img.url);
          return {
            originalRef: `image-${index + 1}`,
            permanentUrl,
            placement: img.placement,
            type: 'url',
            success: true
          };
        } else if (img.type === 'generate') {
          // Generate with DALL-E, then upload to Cloudinary
          log(LogType.INFO, `Processing AI image ${index + 1}`, { description: img.description });
          
          // Generate the image
          const tempUrl = await generateWithDalle(img.description, 'educational');
          
          // Upload to Cloudinary for permanent hosting + optimization
          const permanentUrl = await uploadFromUrl(tempUrl);
          
          log(LogType.INFO, `Image ${index + 1} complete`, { permanentUrl });
          
          return {
            originalRef: `image-${index + 1}`,
            permanentUrl,
            placement: img.placement,
            description: img.description,
            type: 'generated',
            success: true
          };
        } else {
          log(LogType.ERROR, `Unknown image type for image ${index + 1}`, { type: img.type });
          return {
            originalRef: `image-${index + 1}`,
            permanentUrl: null,
            placement: img.placement,
            type: img.type,
            success: false,
            error: `Unknown image type: ${img.type}`
          };
        }
      } catch (error) {
        log(LogType.ERROR, `Image ${index + 1} failed`, { error: error.message });
        return {
          originalRef: `image-${index + 1}`,
          permanentUrl: null,
          placement: img.placement,
          type: img.type,
          success: false,
          error: error.message
        };
      }
    })
  );

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  log(LogType.INFO, `Image processing complete`, { 
    succeeded: successful.length, 
    failed: failed.length,
    urls: successful.map(r => r.permanentUrl)
  });
  
  return results;
}

/**
 * Build a summary of processed images for the AI prompt
 */
export function buildImageContext(processedImages) {
  if (!processedImages || processedImages.length === 0) {
    return '';
  }

  const lines = processedImages
    .filter(img => img.success)
    .map((img, i) => {
      const desc = img.type === 'generated' 
        ? `AI-generated: "${img.description}"` 
        : 'User-provided image';
      return `  ${i + 1}. ${desc}\n     URL: ${img.permanentUrl}\n     Suggested placement: ${img.placement}`;
    });

  if (lines.length === 0) {
    return '';
  }

  return `\n\nIMAGES AVAILABLE (use these exact URLs in your HTML):\n${lines.join('\n')}`;
}
