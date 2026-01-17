---
description: Create a git commit with proper message format and co-authored-by attribution
allowed-tools: Bash(git:*), Read, Grep, Glob
---

# Create Git Commit

Create a properly formatted git commit following project conventions.

## Instructions

1. **Check git status**
   - Run: `git status`
   - Show untracked files and changes
   - Verify we're not on main branch (error if we are)

2. **Review changes**
   - Run: `git diff` for unstaged changes
   - Run: `git diff --staged` for staged changes
   - Summarize what changed

3. **Stage files**
   - Add all relevant files with: `git add <files>`
   - **DO NOT** stage sensitive files (.env, secrets, credentials)
   - Confirm staging with: `git status`

4. **Review recent commits**
   - Run: `git log -5 --oneline`
   - Understand commit message style/format

5. **Draft commit message**
   - Format: Clear, present tense, descriptive
   - Examples:
     - "Add authentication flow with password verification"
     - "Fix image upload error handling"
     - "Update ChatInterface to handle loading states"
     - "Refactor API client for better error handling"

6. **Create commit**
   - Use heredoc format for proper formatting:
     ```bash
     git commit -m "$(cat <<'EOF'
     [Commit message here]

     Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
     EOF
     )"
     ```

7. **Verify commit**
   - Run: `git log -1` to show the commit
   - Run: `git status` to confirm clean working tree

8. **Provide summary**
   - Show commit hash
   - Show commit message
   - Show files changed
   - Remind: Don't forget to push when ready

## Commit Message Format

```
[Clear, descriptive summary in present tense]

[Optional: Additional context if needed]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Examples

**Good commit messages:**
- "Add live preview iframe to ChatInterface"
- "Implement image upload with Cloudinary integration"
- "Fix depth level validation in generate route"
- "Update system prompt to enforce depth levels"

**Bad commit messages (avoid):**
- "changes" (too vague)
- "fixed stuff" (not descriptive)
- "WIP" (not meaningful)
- "asdf" (meaningless)

## Safety Checks

Before committing:
- [ ] Not on main branch
- [ ] No sensitive files staged (.env, credentials, etc.)
- [ ] Changes are related and cohesive
- [ ] Commit message is clear and descriptive
- [ ] Co-authored-by line included
