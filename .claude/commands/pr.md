---
description: Create a pull request with proper summary and description
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob
---

# Create Pull Request

Create a pull request for the current branch with a comprehensive summary.

## Instructions

1. **Verify prerequisites**
   - Check that we're on a branch (not main)
   - Verify `gh` CLI is installed: `gh --version`
   - Check git status is clean (all changes committed)

2. **Review changes**
   - Get commit history: `git log main..HEAD --oneline`
   - Get diff summary: `git diff main...HEAD --stat`
   - Understand scope of changes

3. **Push branch to remote**
   - Check if branch is tracking remote: `git rev-parse --abbrev-ref --symbolic-full-name @{u}`
   - If not tracking, push with: `git push -u origin <branch-name>`
   - If tracking but ahead, push with: `git push`

4. **Analyze changes for PR description**
   - Read modified files to understand changes
   - Identify:
     - New features added
     - Bugs fixed
     - Refactoring done
     - Files modified
     - Dependencies added

5. **Draft PR summary**
   Create a markdown summary with these sections:

   ```markdown
   ## Summary
   [1-3 sentences describing what this PR does]

   ## Changes
   - [Bullet point list of key changes]
   - [Be specific about files/components modified]

   ## Testing
   - [ ] Manual testing completed
   - [ ] All existing functionality still works
   - [ ] New features tested

   ## Deployment Notes
   [Any special notes for deployment, or "None"]

   ---
   Generated with [Claude Code](https://claude.com/claude-code)
   ```

6. **Create PR**
   ```bash
   gh pr create --title "[Clear PR title]" --body "$(cat <<'EOF'
   [PR description here]
   EOF
   )"
   ```

7. **Provide PR link**
   - Show the created PR URL
   - Remind to:
     - Review the PR yourself first
     - Request reviews from team
     - Link any related issues

## PR Title Format

Use clear, present tense titles:
- "Add image upload and AI generation features"
- "Fix authentication error handling"
- "Implement streaming responses for page generation"
- "Refactor API client with better error handling"

## Example PR Body

```markdown
## Summary
Adds AI-powered image generation using DALL-E 3 and Cloudinary hosting. Faculty can now request images to be generated and automatically included in instructional pages.

## Changes
- Added `/api/images/generate` endpoint using OpenAI DALL-E 3 API
- Implemented Cloudinary upload service for permanent image hosting
- Created ImageUploader component in client for file uploads
- Updated system prompt to handle image integration
- Added image URL support to page generation

## Testing
- [x] Manual testing completed
- [x] Image generation works with various prompts
- [x] Uploaded images display correctly in generated pages
- [x] Error handling tested (invalid files, API failures)

## Deployment Notes
Requires environment variables:
- OPENAI_API_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

---
Generated with [Claude Code](https://claude.com/claude-code)
```

## Safety Checks

Before creating PR:
- [ ] All changes committed
- [ ] Branch pushed to remote
- [ ] PR title is descriptive
- [ ] PR body has all sections
- [ ] No sensitive information in description
- [ ] Related issues linked (if applicable)
