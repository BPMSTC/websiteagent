import Anthropic from '@anthropic-ai/sdk';
import { log, logDuration, LogType } from './debugLog.js';

let client = null;

// Initialize client lazily after env vars are loaded
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      log(LogType.ERROR, 'Claude API key not configured');
      throw new Error('ANTHROPIC_API_KEY not configured. Set it in .env file.');
    }
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export async function generate(systemPrompt, messages) {
  const anthropic = getClient();
  const startTime = Date.now();
  
  const logId = log(LogType.API_CALL, 'Claude API request', {
    messageCount: messages.length,
    model: 'claude-sonnet-4-20250514'
  });
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: messages
    });

    const duration = logDuration(logId, startTime);
    
    log(LogType.API_CALL, 'Claude API response', {
      contentLength: response.content[0]?.text?.length,
      tokens: {
        input: response.usage?.input_tokens,
        output: response.usage?.output_tokens
      },
      duration: `${duration}ms`
    });
    
    return response;
  } catch (error) {
    logDuration(logId, startTime);
    log(LogType.ERROR, 'Claude API error', { error: error.message });
    throw error;
  }
}
