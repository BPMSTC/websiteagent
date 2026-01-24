import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate as claudeGenerate } from '../services/claude.js';
import { processImages, buildImageContext } from '../services/imageProcessor.js';
import { verifyGeneratedContent, buildFixPrompt, requiresFix } from '../services/verification.js';
import { log, LogType } from '../services/debugLog.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Max attempts to fix verification issues
const MAX_FIX_ATTEMPTS = 2;

// Load system prompt once at startup
let systemPrompt = '';
(async () => {
  try {
    systemPrompt = await fs.readFile(
      path.join(__dirname, '../prompts/system.txt'),
      'utf-8'
    );
    console.log('System prompt loaded successfully');
  } catch (error) {
    console.error('Failed to load system prompt:', error);
  }
})();

router.post('/', async (req, res) => {
  try {
    const { conversation, config, userMessage } = req.body;

    log(LogType.INFO, 'Generate request received', {
      topic: config?.topic,
      depthLevel: config?.depthLevel,
      conversationLength: conversation?.length,
      hasUserMessage: !!userMessage,
      imageCount: config?.images?.length || 0,
      imageTypes: config?.images?.map(i => i.type) || []
    });

    // Process images first (only on initial generation, not follow-up messages)
    let processedImages = [];
    if (!userMessage && config?.images?.length > 0) {
      log(LogType.INFO, 'Starting image processing', { count: config.images.length });
      processedImages = await processImages(config.images);
    }

    // Build messages array for Claude API
    let messages = [
      ...conversation,
      { role: 'user', content: buildUserMessage(config, userMessage, processedImages) }
    ];

    // Call Claude API
    let response = await claudeGenerate(systemPrompt, messages);

    // Parse response to extract message and HTML
    let { message, html } = parseClaudeResponse(response);

    log(LogType.INFO, 'Initial generation complete', { htmlLength: html?.length || 0 });

    // Verification loop - check and fix issues (only on initial generation)
    if (!userMessage) {
      let attempts = 0;
      let issues = verifyGeneratedContent(html, processedImages, config);
      
      while (requiresFix(issues) && attempts < MAX_FIX_ATTEMPTS) {
        attempts++;
        log(LogType.VERIFICATION, `Fix attempt ${attempts}`, {
          issueCount: issues.length,
          issues: issues.map(i => i.message)
        });

        // Build fix prompt and add to conversation
        const fixPrompt = buildFixPrompt(issues);
        messages = [
          ...messages,
          { role: 'assistant', content: response.content[0].text },
          { role: 'user', content: fixPrompt }
        ];

        // Call Claude again to fix
        response = await claudeGenerate(systemPrompt, messages);
        const fixed = parseClaudeResponse(response);
        html = fixed.html;
        message = fixed.message;

        // Re-verify
        issues = verifyGeneratedContent(html, processedImages, config);
      }

      if (issues.length > 0) {
        log(LogType.VERIFICATION, 'Verification complete with issues', {
          remainingIssues: issues.map(i => `${i.severity}: ${i.message}`)
        });
      } else {
        log(LogType.VERIFICATION, 'Verification passed', { status: 'All checks OK' });
      }
    }

    log(LogType.INFO, 'Generation successful', {
      htmlLength: html?.length || 0,
      imagesProcessed: processedImages.length,
      imagesSuccessful: processedImages.filter(i => i.success).length
    });

    res.json({
      message,
      html,
      imagesGenerated: processedImages.filter(img => img.type === 'generated' && img.success)
    });

  } catch (error) {
    log(LogType.ERROR, 'Generation failed', {
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
});

function buildUserMessage(config, userMessage, processedImages = []) {
  // First message: include full config
  if (!userMessage) {
    const styleFlagsText = config.styleFlags && config.styleFlags.length > 0 
      ? config.styleFlags.join(', ') 
      : 'None';
    
    // Build image context from processed images (with permanent URLs)
    const imageContext = buildImageContext(processedImages);

    return `Please create an instructional page with the following configuration:

Topic: ${config.topic}
Depth Level: ${config.depthLevel}
Style Flags: ${styleFlagsText}${imageContext}

Generate the HTML page now. Use the exact image URLs provided above in <img> tags with appropriate alt text.`;
  }

  // Subsequent messages: just the user's request
  return userMessage;
}

function parseClaudeResponse(response) {
  const content = response.content[0].text;

  // Extract HTML from code block
  const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/);
  const html = htmlMatch ? htmlMatch[1] : '';

  // Extract message (text before code block)
  const message = content.split('```html')[0].trim();

  return { message, html };
}

export default router;
