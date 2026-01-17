# Claude Code Configuration

This directory contains Claude Code configuration that enhances AI-assisted development for this project.

## What's Inside

```
.claude/
├── README.md                    # This file
├── settings.json               # Hook configurations and environment
├── settings.local.json         # Local overrides (git-ignored)
├── commands/                   # Slash commands for common workflows
│   ├── dev.md                 # Start development servers
│   ├── build.md               # Build for production
│   ├── commit.md              # Create git commit
│   └── pr.md                  # Create pull request
├── skills/                    # Reusable knowledge and patterns
│   ├── README.md              # Skills index
│   ├── react-component-patterns/
│   ├── api-client-patterns/
│   ├── prompt-engineering/
│   └── express-api-patterns/
└── hooks/                     # Automation scripts
    ├── pre-commit-check.sh    # Prevent commits on main
    └── post-install.sh        # Verify environment setup
```

## Quick Start

### Using Commands

Commands are invoked with `/command-name`:

```bash
/dev      # Start development servers
/build    # Build client for production
/commit   # Create a git commit with proper format
/pr       # Create a pull request
```

### Using Skills

Skills are automatically suggested based on your prompts. You can also manually activate them:

- **react-component-patterns**: "Create a new React component for..."
- **api-client-patterns**: "Build an API client for..."
- **prompt-engineering**: "Update the Claude system prompt..."
- **express-api-patterns**: "Add a new Express route..."

### Hooks in Action

Hooks run automatically:

- **Pre-commit check**: Blocks commits on main branch
- **Post-install warning**: Reminds about dependencies after package.json changes

## Project Memory (CLAUDE.md)

The `../CLAUDE.md` file at the project root contains:
- Tech stack and commands
- Directory structure
- Code style guidelines
- Critical rules and constraints
- Depth level definitions
- Environment variables
- Common patterns

This file is loaded automatically and provides Claude with project-specific knowledge.

## How It Works

### Commands
Commands are markdown files with frontmatter that define reusable workflows. They can:
- Use bash commands via allowed-tools
- Read files to gather context
- Provide step-by-step instructions
- Handle common tasks consistently

Example:
```yaml
---
description: Start development environment
allowed-tools: Bash(npm:*), Read
---

# Instructions here...
```

### Skills
Skills are markdown documents teaching Claude project patterns. They include:
- Core principles
- CORRECT vs WRONG code examples
- Checklists
- Anti-patterns
- Integration with other skills

**Key feature**: The `description` field in frontmatter is used for semantic matching - Claude automatically suggests relevant skills based on your prompts.

### Hooks
Hooks are bash scripts that run at specific lifecycle points:

- **PreToolUse**: Before a tool executes (can block)
- **PostToolUse**: After a tool executes (non-blocking)
- **UserPromptSubmit**: When user submits a prompt

Hooks can:
- Return exit code 0 (success)
- Return exit code 1 (non-blocking warning)
- Return exit code 2 (blocking error - PreToolUse only)
- Output JSON with feedback to stderr

## Customization

### Local Overrides

Create `.claude/settings.local.json` for personal settings:
```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)"
    ]
  }
}
```

This file is git-ignored and won't affect team members.

### Adding New Skills

1. Create directory: `.claude/skills/[skill-name]/`
2. Add `SKILL.md`:
   ```yaml
   ---
   name: skill-name
   description: When to use it (with keywords)
   allowed-tools: Read, Grep, Glob
   ---

   # Content...
   ```

### Adding New Commands

1. Create `.claude/commands/[command-name].md`
2. Add frontmatter and instructions:
   ```yaml
   ---
   description: What it does
   allowed-tools: Bash(npm:*), Read
   ---

   # Instructions...
   ```

### Adding New Hooks

1. Create bash script in `.claude/hooks/`
2. Make it executable: `chmod +x .claude/hooks/[hook-name].sh`
3. Add to `settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash(git commit:*)",
           "hooks": [{
             "type": "command",
             "command": "bash \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/[hook-name].sh",
             "timeout": 5
           }]
         }
       ]
     }
   }
   ```

## Environment Variables

Available in hooks:
- `$CLAUDE_PROJECT_DIR`: Project root directory
- `$CLAUDE_TOOL_INPUT_FILE_PATH`: File being modified (for Edit/Write hooks)
- `$CLAUDE_TOOL_NAME`: Name of the tool being used

## Best Practices

### For Skills
- Include concrete code examples, not just principles
- Show both CORRECT and WRONG patterns
- Add checklists for before/after completion
- Cross-reference related skills
- Keep descriptions keyword-rich for better matching

### For Commands
- Provide step-by-step instructions
- Handle error cases gracefully
- Give clear feedback to users
- Use allowed-tools to restrict scope
- Document expected outputs

### For Hooks
- Keep execution time under 5 seconds
- Return meaningful feedback in JSON
- Use exit codes appropriately
- Test thoroughly before committing
- Document what the hook does

## Learned from Best Practices

This setup is inspired by and follows patterns from the [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) repository, which demonstrates production-grade Claude Code configuration.

Key patterns applied:
- ✅ Project memory in CLAUDE.md
- ✅ Skills with semantic matching via descriptions
- ✅ Commands for common workflows
- ✅ Hooks for automation and safety
- ✅ Centralized configuration in settings.json
- ✅ Git-committed configuration for team consistency

## Contributing

When adding or modifying configuration:
1. Test thoroughly
2. Document changes
3. Update this README if needed
4. Commit to share with team

## Support

For issues or questions about Claude Code:
- Check `/help` command
- See [Claude Code documentation](https://docs.anthropic.com)
- Review project documentation in `../` (PLAN.md, IMPLEMENTATION_GUIDE.md, etc.)
