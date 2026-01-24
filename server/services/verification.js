/**
 * Verification service to check generated HTML before showing to user
 * Returns issues that need to be fixed, or empty array if all checks pass
 */

export function verifyGeneratedContent(html, processedImages = [], config = {}) {
  const issues = [];

  // Check 1: HTML exists and is not empty
  if (!html || html.trim().length < 100) {
    issues.push({
      type: 'missing_html',
      severity: 'critical',
      message: 'No HTML content was generated or content is too short'
    });
    return issues; // Can't do other checks without HTML
  }

  // Check 2: All requested images are used
  const imageIssues = verifyImagesUsed(html, processedImages);
  issues.push(...imageIssues);

  // Check 3: All images have alt text
  const altTextIssues = verifyAltText(html);
  issues.push(...altTextIssues);

  // Check 4: Code blocks use highlight.js format
  const codeIssues = verifyCodeBlocks(html);
  issues.push(...codeIssues);

  // Check 5: No placeholder content
  const placeholderIssues = verifyNoPlaceholders(html);
  issues.push(...placeholderIssues);

  return issues;
}

function verifyImagesUsed(html, processedImages) {
  const issues = [];
  
  if (!processedImages || processedImages.length === 0) {
    return issues;
  }

  const successfulImages = processedImages.filter(img => img.success && img.permanentUrl);
  
  for (const img of successfulImages) {
    if (!html.includes(img.permanentUrl)) {
      issues.push({
        type: 'unused_image',
        severity: 'high',
        message: `Image not used in HTML`,
        details: {
          url: img.permanentUrl,
          placement: img.placement,
          description: img.description || 'User-provided image'
        }
      });
    }
  }

  return issues;
}

function verifyAltText(html) {
  const issues = [];
  
  // Find all img tags
  const imgRegex = /<img[^>]*>/gi;
  const imgTags = html.match(imgRegex) || [];

  for (const imgTag of imgTags) {
    // Check for alt attribute
    const hasAlt = /alt\s*=\s*["'][^"']+["']/i.test(imgTag);
    const hasEmptyAlt = /alt\s*=\s*["']\s*["']/i.test(imgTag);
    
    if (!hasAlt || hasEmptyAlt) {
      // Extract src for reference
      const srcMatch = imgTag.match(/src\s*=\s*["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : 'unknown';
      
      issues.push({
        type: 'missing_alt_text',
        severity: 'medium',
        message: `Image missing alt text`,
        details: { src: src.substring(0, 80) + (src.length > 80 ? '...' : '') }
      });
    }
  }

  return issues;
}

function verifyCodeBlocks(html) {
  const issues = [];
  
  // Check if there are code examples in the HTML
  const hasCodeTag = /<code[^>]*>/i.test(html);
  const hasPreTag = /<pre[^>]*>/i.test(html);
  
  if (hasCodeTag || hasPreTag) {
    // Check for proper highlight.js format: <pre><code class="language-xxx">
    const properFormat = /<pre[^>]*>\s*<code[^>]*class\s*=\s*["'][^"']*language-/i.test(html);
    
    // Also check if highlight.js CSS/JS is included
    const hasHighlightCSS = /highlight\.js|highlightjs|hljs/i.test(html);
    
    if (!properFormat) {
      issues.push({
        type: 'code_format',
        severity: 'low',
        message: 'Code blocks should use <pre><code class="language-xxx"> format for syntax highlighting'
      });
    }
    
    if (!hasHighlightCSS) {
      issues.push({
        type: 'missing_highlightjs',
        severity: 'low',
        message: 'Code blocks present but highlight.js CSS/JS may not be included'
      });
    }
  }

  return issues;
}

function verifyNoPlaceholders(html) {
  const issues = [];
  
  const placeholderPatterns = [
    { pattern: /lorem ipsum/i, name: 'Lorem ipsum placeholder text' },
    { pattern: /\[TODO\]/i, name: '[TODO] marker' },
    { pattern: /\[INSERT.*?\]/i, name: '[INSERT...] placeholder' },
    { pattern: /\[YOUR.*?HERE\]/i, name: '[YOUR...HERE] placeholder' },
    { pattern: /placeholder\s*image/i, name: 'Placeholder image reference' },
    { pattern: /example\.com\/image/i, name: 'example.com placeholder URL' }
  ];

  for (const { pattern, name } of placeholderPatterns) {
    if (pattern.test(html)) {
      issues.push({
        type: 'placeholder_content',
        severity: 'medium',
        message: `Contains placeholder: ${name}`
      });
    }
  }

  return issues;
}

/**
 * Build a prompt to fix verification issues
 */
export function buildFixPrompt(issues) {
  const issueDescriptions = issues.map((issue, i) => {
    let desc = `${i + 1}. ${issue.message}`;
    if (issue.details) {
      if (issue.details.url) desc += `\n   - URL to include: ${issue.details.url}`;
      if (issue.details.placement) desc += `\n   - Suggested placement: ${issue.details.placement}`;
      if (issue.details.description) desc += `\n   - Image description: ${issue.details.description}`;
    }
    return desc;
  }).join('\n');

  return `Please fix the following issues with the generated HTML:

${issueDescriptions}

Regenerate the complete HTML with these issues fixed. Make sure to:
- Include ALL images with proper <img> tags and meaningful alt text
- Use exact URLs provided for images
- Remove any placeholder content
- Use <pre><code class="language-xxx"> format for code blocks with highlight.js`;
}

/**
 * Check if issues are severe enough to require a fix
 */
export function requiresFix(issues) {
  // Critical or high severity issues require a fix
  return issues.some(issue => 
    issue.severity === 'critical' || 
    issue.severity === 'high' ||
    issue.type === 'unused_image'
  );
}
