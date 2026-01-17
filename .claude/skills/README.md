# Skills Index

This directory contains skills that teach Claude project-specific patterns and best practices.

## Available Skills

### 1. react-component-patterns
**When to use:** Creating React components, managing state, handling user interactions

**Key topics:**
- Component structure and organization
- The four states pattern (loading, error, empty, success)
- Custom hooks
- Props patterns
- Event handling
- Conditional rendering
- List rendering with proper keys

**Activation keywords:** react, component, jsx, state, hooks, useState, useEffect

---

### 2. api-client-patterns
**When to use:** Building API clients, making HTTP requests, handling API responses

**Key topics:**
- Centralized API client setup with axios
- Error handling and transformation
- Request configuration (timeout, headers, cancellation)
- Streaming responses
- Retry logic with exponential backoff
- File uploads with progress tracking
- Environment-based configuration

**Activation keywords:** api, axios, http, request, fetch, endpoint, client

---

### 3. prompt-engineering
**When to use:** Working with Claude API, designing prompts, implementing AI features

**Key topics:**
- System prompt structure
- Depth level enforcement (0-4)
- Conversation context management
- HTML extraction from responses
- Streaming generation
- Image integration
- Error handling

**Activation keywords:** claude, prompt, ai, llm, anthropic, generation, system prompt

---

### 4. express-api-patterns
**When to use:** Building Express routes, implementing middleware, handling backend requests

**Key topics:**
- Server setup and configuration
- Route structure and organization
- Middleware patterns (auth, validation, rate limiting)
- Error handling
- Service layer separation
- File upload handling
- Environment configuration

**Activation keywords:** express, route, middleware, endpoint, backend, server

---

## How Skills Work

Skills are automatically suggested based on:
1. **Keywords in your prompt** - Matching skill descriptions
2. **File paths mentioned** - e.g., mentioning `client/src/components` suggests react-component-patterns
3. **Task intent** - What you're trying to accomplish

To manually activate a skill, just mention it by name or include its keywords in your prompt.

## Creating New Skills

When adding a new skill:
1. Create directory: `.claude/skills/[skill-name]/`
2. Add `SKILL.md` with:
   ```yaml
   ---
   name: skill-name
   description: What it does and when to use it (include keywords!)
   allowed-tools: Read, Grep, Glob
   ---

   # Skill Content Here
   ```
3. Include:
   - Core principles
   - CORRECT vs WRONG examples
   - Checklists
   - Common mistakes
   - Integration with other skills

## Skill Best Practices

- **Be specific** - Show concrete code examples, not abstractions
- **Show anti-patterns** - WRONG examples teach as much as correct ones
- **Include checklists** - Before/after completion items
- **Cross-reference** - Link to related skills
- **Keep focused** - One skill per domain/concept
- **Update regularly** - As patterns evolve, update skills
