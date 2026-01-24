import { v2 as cloudinary } from 'cloudinary';
import { log, logDuration, LogType } from './debugLog.js';

// Lazy initialization flag
let isConfigured = false;

function ensureConfigured() {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
    log(LogType.INFO, 'Cloudinary configured', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    });
  }
}

// Optimization settings for web-ready images
const optimizationOptions = {
  folder: 'instructional-pages',
  transformation: [
    { width: 1000, crop: 'limit' },  // Max width 1000px, maintain aspect ratio
    { quality: 'auto:good' },         // Auto quality optimization
    { fetch_format: 'auto' }          // Auto format (WebP where supported)
  ],
  resource_type: 'image'
};

export async function upload(buffer) {
  ensureConfigured();
  const startTime = Date.now();
  const logId = log(LogType.IMAGE_UPLOAD, 'Cloudinary buffer upload started', {
    bufferSize: buffer.length
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      optimizationOptions,
      (error, result) => {
        const duration = logDuration(logId, startTime);
        if (error) {
          log(LogType.ERROR, 'Cloudinary upload failed', { error: error.message });
          reject(error);
        } else {
          log(LogType.IMAGE_UPLOAD, 'Cloudinary upload complete', {
            duration: `${duration}ms`,
            url: result.secure_url,
            bytes: result.bytes,
            format: result.format
          });
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function uploadFromUrl(url) {
  ensureConfigured();
  const startTime = Date.now();
  
  // Check if this is a base64 data URL (GPT Image models return base64)
  const isDataUrl = url.startsWith('data:');
  
  const logId = log(LogType.IMAGE_UPLOAD, 'Cloudinary upload started', {
    type: isDataUrl ? 'base64' : 'url',
    sourcePreview: isDataUrl ? 'data:image/...(base64)' : url.substring(0, 80) + '...'
  });

  try {
    // Cloudinary accepts both URLs and data URLs directly
    const result = await cloudinary.uploader.upload(url, optimizationOptions);
    const duration = logDuration(logId, startTime);
    
    log(LogType.IMAGE_UPLOAD, 'Cloudinary upload complete', {
      duration: `${duration}ms`,
      permanentUrl: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height
    });
    
    return result.secure_url;
  } catch (error) {
    logDuration(logId, startTime);
    log(LogType.ERROR, 'Cloudinary upload failed', { 
      error: error.message,
      type: isDataUrl ? 'base64' : 'url'
    });
    throw error;
  }
}

// Generate an optimized URL for an existing Cloudinary image
export function getOptimizedUrl(publicId) {
  ensureConfigured();
  return cloudinary.url(publicId, {
    transformation: [
      { width: 1000, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
}
