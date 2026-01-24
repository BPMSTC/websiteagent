import OpenAI from 'openai';
import { log, logDuration, LogType } from './debugLog.js';

let openai = null;

// Initialize OpenAI client only if API key is available
function getClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function generate(prompt, style = 'educational') {
  const client = getClient();
  
  if (!client) {
    log(LogType.ERROR, 'OpenAI API key not configured');
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env file.');
  }

  const stylePrompts = {
    educational: 'Clean, educational illustration style, clear and simple',
    diagram: 'Technical diagram style, clear labels and structure',
    realistic: 'Photorealistic style, professional quality',
    illustration: 'Hand-drawn illustration style, friendly and approachable'
  };

  const fullPrompt = `${prompt}. ${stylePrompts[style] || stylePrompts.educational}`;
  const startTime = Date.now();
  
  const logId = log(LogType.IMAGE_GEN, 'GPT-image-1.5 generation started', {
    prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
    style,
    model: 'gpt-image-1.5'
  });

  try {
    const response = await client.images.generate({
      model: 'gpt-image-1.5',
      prompt: fullPrompt,
      size: '1024x1024',
      quality: 'high',
      n: 1,
    });

    const duration = logDuration(logId, startTime);
    const imageData = response.data[0];
    
    // gpt-image-1.5 returns base64 by default, but can return URL
    const tempUrl = imageData.url || `data:image/png;base64,${imageData.b64_json}`;
    
    log(LogType.IMAGE_GEN, 'GPT-image-1.5 generated successfully', {
      duration: `${duration}ms`,
      format: imageData.url ? 'url' : 'base64'
    });

    return tempUrl;
  } catch (error) {
    logDuration(logId, startTime);
    log(LogType.ERROR, 'GPT-image-1.5 generation failed', { 
      error: error.message,
      code: error.code,
      status: error.status
    });
    throw error;
  }
}
