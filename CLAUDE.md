# Instructional Page Builder - Project Memory

## Quick Facts

**Stack:**
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI: Anthropic Claude API (HTML generation), OpenAI DALL-E 3 (images)
- Image Hosting: Cloudinary
- Deployment: Vercel or Railway

**Key Commands:**
```bash
npm run dev              # Start both client and server
npm run dev:client       # Start only client (port 5173)
npm run dev:server       # Start only server (port 3001)
npm run build            # Build client for production
```

**Development:**
```bash
cd client && npm run dev        # Client only
cd server && npm run dev        # Server only (nodemon)
```

---

## Project Purpose

An AI-powered tool for faculty to create educational HTML pages through conversation. Faculty describe what they want to teach, select depth level (0-4), and iteratively refine through natural language. Output is a single-file HTML ready for Blackboard LMS.

**Key Workflow:**
1. Faculty enters password (shared)
2. Configures: topic, depth level (0-4), style flags
3. Conversational refinement with AI
4. Live preview in iframe
5. Copy/download HTML for Blackboard

---

## Directory Structure

```
.
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks (useChat, useClipboard)
│   │   ├── utils/            # API client
│   │   └── index.css         # Tailwind imports
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                   # Express backend
│   ├── index.js             # Server entry point
│   ├── routes/              # API routes (auth, generate, images)
│   ├── services/            # API wrappers (Claude, DALL-E, Cloudinary)
│   └── prompts/             # System prompt for AI agent
├── .env                     # Environment variables (secrets)
├── .env.example            # Template for environment variables
└── package.json            # Root workspace config
```

---

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer functional components with hooks over class components
- Component files: PascalCase (e.g., `ChatInterface.jsx`)
- Utility files: camelCase (e.g., `api.js`)
- Use `const` by default, `let` only when reassignment needed

### React Patterns
- Single responsibility - one component per file
- Props destructuring at function signature
- Early returns for loading/error states
- Custom hooks for reusable logic
- Lift state up when needed by multiple components

### Tailwind CSS
- Use utility classes over custom CSS
- Group related utilities: layout → spacing → colors → typography
- Use responsive prefixes: `sm:`, `md:`, `lg:`
- Extract repeated patterns to components, not @apply directives

### API Design
- RESTful endpoints: `/api/resource`
- POST for mutations, GET for queries
- Always return JSON with consistent structure
- Error responses: `{ error: "message" }`
- Success responses: `{ data: {...}, message: "optional" }`

---

## Critical Rules & Constraints

### Security
- NEVER commit `.env` file (it's in .gitignore)
- Passwords must be in environment variables only
- API keys: ANTHROPIC_API_KEY, OPENAI_API_KEY, CLOUDINARY_* in .env
- Sanitize user input before passing to APIs
- Use CORS properly in Express

### AI Integration
- System prompt in `server/prompts/system.txt` is critical - defines agent behavior
- Depth levels (0-4) must be strictly enforced by prompt
- Claude API: Use streaming for better UX
- DALL-E: Generate images only when requested, upload to Cloudinary
- Always include conversation history for context

### UI States
Always handle these states in components:
1. **Loading**: Show spinner/skeleton
2. **Error**: Display error message with retry option
3. **Empty**: Show helpful placeholder
4. **Success**: Display data

### HTML Generation
- Output must be single-file HTML (self-contained)
- All images must use external URLs (Cloudinary)
- Inline CSS and JavaScript (no external dependencies)
- Must work when pasted into Blackboard LMS
- Accessible: proper semantic HTML, ARIA labels

### Git Workflow
- Branch naming: `feature/description` or `fix/description`
- Commit messages: Clear, descriptive (present tense)
- Don't commit to main directly
- Include co-authored-by for AI assistance

---

## Environment Variables

Required in `.env`:
```
FACULTY_PASSWORD=changeme
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3001
NODE_ENV=development
```

Get API keys:
- Anthropic: https://console.anthropic.com
- OpenAI: https://platform.openai.com
- Cloudinary: https://cloudinary.com (free tier)

---

## Depth Levels (Critical)

| Level | Name | Use Case | Example |
|-------|------|----------|---------|
| 0 | Minimalist | Reference, cheat sheet | CSS Flexbox property table |
| 1 | Introductory | Complete beginners | "What is a variable?" |
| 2 | Intermediate | CS students | JavaScript Promises with examples |
| 3 | Advanced | Professional developers | RESTful API best practices |
| 4 | Graduate | Academic/theoretical | Complexity theory, formal proofs |

**Key rule:** Agent NEVER mixes levels. Level 1 stays at Level 1 even if more detail would be "better."

---

## Skill Activation Guide

Before starting any task, check if these skills apply:

### React Development
- Building components → **react-component-patterns** skill
- Managing state → **react-state-patterns** skill
- API integration → **api-client-patterns** skill

### Backend Development
- Express routes → **express-api-patterns** skill
- Claude API integration → **prompt-engineering** skill
- Error handling → **error-handling-patterns** skill

### Testing & Quality
- Writing tests → **testing-patterns** skill
- Debugging → **systematic-debugging** skill
- Code review → **code-review-checklist** skill

### Documentation
- Updating docs → **documentation-patterns** skill
- README/guides → **technical-writing** skill

---

## Common Patterns

### API Client Structure
```javascript
// client/src/utils/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const generatePage = async (config, message, history) => {
  const response = await axios.post(`${API_BASE}/generate`, {
    config,
    message,
    history
  });
  return response.data;
};
```

### Component Pattern
```javascript
// client/src/components/Example.jsx
import { useState, useEffect } from 'react';

export default function Example({ prop1, prop2 }) {
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effects
  useEffect(() => {
    // Side effects here
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {
    // Logic here
  };

  // Early returns for states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  // Main render
  return (
    <div className="container mx-auto p-4">
      {/* Content */}
    </div>
  );
}
```

### Express Route Pattern
```javascript
// server/routes/example.js
import express from 'express';
const router = express.Router();

router.post('/endpoint', async (req, res) => {
  try {
    const { param1, param2 } = req.body;

    // Validation
    if (!param1) {
      return res.status(400).json({ error: 'param1 is required' });
    }

    // Business logic
    const result = await someService(param1, param2);

    // Success response
    res.json({ data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## Troubleshooting

### Client won't start
- Check `client/package.json` exists
- Run `npm install` in client directory
- Verify port 5173 is available

### Server won't start
- Check `.env` file exists with required keys
- Run `npm install` in server directory
- Verify port 3001 is available

### API errors
- Check API keys in `.env` are valid
- Check CORS configuration in `server/index.js`
- Verify network requests in browser DevTools

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be 18+)

---

## Testing Strategy

### What to Test
- React components: render, user interactions, state changes
- API routes: request/response, error handling, validation
- Services: API integrations, error cases
- Utilities: pure functions, edge cases

### Test Commands
```bash
# When implemented
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- ComponentName  # Test specific component
```

---

## Deployment Checklist

Before deploying:
- [ ] All environment variables set in production
- [ ] Build succeeds: `npm run build`
- [ ] API keys are valid and have quota
- [ ] CORS configured for production domain
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Responsive design tested
- [ ] Accessibility checked

---

## Links & Resources

- **Anthropic Docs**: https://docs.anthropic.com
- **OpenAI DALL-E**: https://platform.openai.com/docs/guides/images
- **Cloudinary**: https://cloudinary.com/documentation
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Express Docs**: https://expressjs.com

---

## Project Documentation

- `PLAN.md` - Complete architecture and design
- `IMPLEMENTATION_GUIDE.md` - Step-by-step build instructions
- `EXAMPLE_FLOWS.md` - Usage examples and workflows
- `DEPLOYMENT.md` - Production deployment guide
- `PROJECT_SUMMARY.md` - Executive summary

---

## Important Notes

1. **Single-file HTML**: All generated pages must be self-contained (inline CSS/JS, external image URLs only)
2. **Depth level adherence**: The AI agent must strictly follow the selected depth level
3. **Blackboard compatibility**: HTML must work when pasted into Blackboard's content editor
4. **Cost awareness**: Monitor API usage (Claude + DALL-E costs)
5. **Faculty-friendly**: Interface must be simple, no technical knowledge required
