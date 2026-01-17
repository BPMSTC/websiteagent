# Instructional Page Builder - Project Plan

## Overview

A lightweight web application that allows faculty to create single-page instructional websites through conversational AI. Faculty describe what they want to teach, select a depth level, and iteratively refine the output through natural language ("vibe coding"). The generated HTML can be copied directly into Blackboard LMS.

---

## Core Features

### 1. Simple Authentication
- Single shared password known by all faculty
- No user accounts or persistent sessions
- Password stored as environment variable, checked on app load

### 2. Initial Configuration Panel
Faculty configure these settings before starting:

| Setting | Type | Options |
|---------|------|---------|
| **Topic** | Text input | Free-form subject description |
| **Depth Level** | Radio/Cards | Level 0-4 (with descriptions) |
| **Style Flags** | Checkboxes | Accessibility, Visual-heavy, Technical, Conversational, Humor |
| **Images** | Upload + URL input | Multiple images allowed |

### 3. Conversational Interface
- Chat-style interface for iterative refinement
- Faculty can request changes in natural language
- Full conversation history visible during session
- Context maintained across the conversation

### 4. Live Preview
- Rendered HTML preview updates after each generation
- Sandboxed iframe for security
- Accurate representation of final output

### 5. Export Options
- **Copy HTML**: One-click copy to clipboard
- **Download**: Save as .html file

### 6. AI Image Generation
- When faculty requests an image or one is needed for the concept
- Integration with DALL-E or Stability AI
- Generated images hosted externally (Cloudinary) for Blackboard compatibility

---

## Technical Architecture

### Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + Vite | Fast dev experience, simple setup |
| Styling | Tailwind CSS | Rapid UI development |
| Backend | Node.js + Express | Simple API layer |
| LLM | Anthropic Claude API | For page generation and content authoring |
| Image Generation | OpenAI DALL-E 3 | For AI-generated educational images |
| Image Hosting | Cloudinary | Free tier, permanent URLs for Blackboard |
| Deployment | Vercel or Railway | Easy deployment, good free tiers |

### API Usage Summary

**Anthropic Claude API:**
- Used for: HTML page generation, content iteration, conversational refinement
- Model: claude-sonnet-4-20250514 (fast, cost-effective)
- Endpoint: `/api/generate`

**OpenAI API:**
- Used for: AI image generation when faculty requests images or concepts need visual support
- Model: DALL-E 3
- Endpoint: `/api/images/generate`

### File Structure

```
instructional-page-builder/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── AuthGate.jsx           # Password entry
│   │   │   ├── ConfigPanel.jsx        # Initial setup (topic, depth, flags)
│   │   │   ├── ChatInterface.jsx      # Conversation UI
│   │   │   ├── MessageBubble.jsx      # Individual messages
│   │   │   ├── ImageUploader.jsx      # Drag-drop + URL input
│   │   │   ├── PreviewPane.jsx        # Rendered HTML iframe
│   │   │   ├── ExportButtons.jsx      # Copy + Download
│   │   │   ├── DepthSelector.jsx      # Level 0-4 cards
│   │   │   └── StyleFlags.jsx         # Checkbox group
│   │   ├── hooks/
│   │   │   ├── useChat.js             # Chat state management
│   │   │   └── useClipboard.js        # Copy functionality
│   │   ├── utils/
│   │   │   └── api.js                 # API client functions
│   │   ├── index.css                  # Tailwind imports
│   │   └── main.jsx                   # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── index.js                # Server entry point
│   ├── routes/
│   │   ├── auth.js             # Password verification
│   │   ├── generate.js         # LLM generation endpoint
│   │   └── images.js           # Image upload + AI generation
│   ├── services/
│   │   ├── claude.js           # Claude API wrapper
│   │   ├── imageGen.js         # DALL-E API wrapper
│   │   └── cloudinary.js       # Image upload service
│   ├── prompts/
│   │   └── system.txt          # System prompt for the agent
│   └── package.json
│
├── .env.example                # Environment variables template
├── README.md                   # Setup instructions
└── package.json                # Root package.json (workspaces)
```

---

## API Endpoints

### POST /api/auth/verify
Verify the shared faculty password.

**Request:**
```json
{
  "password": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### POST /api/generate
Generate or update the instructional page.

**Request:**
```json
{
  "conversation": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "config": {
    "topic": "string",
    "depthLevel": 0 | 1 | 2 | 3 | 4,
    "styleFlags": ["accessibility", "visual-heavy", "technical", "conversational", "humor"],
    "images": [
      {
        "url": "string",
        "description": "string (optional)"
      }
    ]
  },
  "userMessage": "string"
}
```

**Response:**
```json
{
  "message": "string (assistant response)",
  "html": "string (complete HTML document)",
  "imagesGenerated": [
    {
      "url": "string",
      "prompt": "string"
    }
  ]
}
```

---

### POST /api/images/upload
Upload an image file to Cloudinary.

**Request:** multipart/form-data with image file

**Response:**
```json
{
  "url": "string (permanent Cloudinary URL)"
}
```

---

### POST /api/images/generate
Generate an image using AI.

**Request:**
```json
{
  "prompt": "string",
  "style": "educational" | "diagram" | "realistic" | "illustration"
}
```

**Response:**
```json
{
  "url": "string (Cloudinary-hosted URL)"
}
```

---

## System Prompt for LLM Agent

See `server/prompts/system.txt` for the complete prompt. Key behaviors:

1. **Role**: Instructional content author generating HTML pages
2. **Output Format**: Always returns valid, complete HTML documents
3. **Depth Adherence**: Strictly follows the specified depth level (0-4)
4. **Style Flags**: Applies requested presentation modifiers
5. **Image Handling**: References provided images, requests generation when needed
6. **Iteration**: Understands context from previous messages, makes targeted edits
7. **Framework Usage**: Uses Tailwind CSS via CDN for styling
8. **Self-Contained**: All CSS/JS embedded or CDN-linked, single file output

---

## UI/UX Flow

### Screen 1: Password Entry
```
┌─────────────────────────────────────────┐
│                                         │
│     Instructional Page Builder          │
│                                         │
│     [Enter faculty password]            │
│                                         │
│           [Continue →]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: Configuration
```
┌─────────────────────────────────────────┐
│  What would you like to teach?          │
│  ┌───────────────────────────────────┐  │
│  │ e.g., "JavaScript async/await"   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Select depth level:                    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│  │  0  │ │  1  │ │  2  │ │  3  │ │  4  ││
│  │Min. │ │Intro│ │Inter│ │Adv. │ │Grad ││
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘│
│                                         │
│  Style options (optional):              │
│  ☐ Accessible  ☐ Visual-heavy           │
│  ☐ Technical   ☐ Conversational         │
│  ☐ Humor                                │
│                                         │
│  Images (optional):                     │
│  ┌───────────────────────────────────┐  │
│  │  Drop images here or click to    │  │
│  │  upload. You can also paste URLs │  │
│  └───────────────────────────────────┘  │
│                                         │
│         [Generate Page →]               │
└─────────────────────────────────────────┘
```

### Screen 3: Builder (Main Interface)
```
┌─────────────────────────────────────────────────────────────────┐
│  Instructional Page Builder                    [New Page] [?]   │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│  Topic: JavaScript Async    │   ┌─────────────────────────────┐ │
│  Depth: 2 | Flags: Visual   │   │                             │ │
│  ─────────────────────────  │   │    Live Preview             │ │
│                             │   │                             │ │
│  🤖 Here's your page on     │   │    (rendered HTML)          │ │
│  JavaScript async/await...  │   │                             │ │
│                             │   │                             │ │
│  ─────────────────────────  │   │                             │ │
│                             │   │                             │ │
│  You: Add more examples     │   │                             │ │
│       of error handling     │   │                             │ │
│                             │   │                             │ │
│  ─────────────────────────  │   │                             │ │
│                             │   │                             │ │
│  🤖 I've added a section... │   │                             │ │
│                             │   │                             │ │
│  ─────────────────────────  │   └─────────────────────────────┘ │
│                             │                                   │
│  ┌───────────────────────┐  │   [Copy HTML]  [Download .html]   │
│  │ Type changes here...  │  │                                   │
│  └───────────────────────┘  │                                   │
│  [Send] [+ Image] [🎨 Gen]  │                                   │
│                             │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## Depth Level Descriptions (for UI)

| Level | Name | Description |
|-------|------|-------------|
| 0 | Minimalist | Direct answers only. No explanation or context. |
| 1 | Introductory | Clear, simple explanations. Assumes first exposure. No code unless requested. |
| 2 | Intermediate | Explains how and why. Includes examples and code when helpful. |
| 3 | Advanced | Professional depth. Design decisions, trade-offs, production-ready code. |
| 4 | Graduate | Theoretical analysis. Connects implementation to underlying principles. |

---

## Style Flag Descriptions (for UI)

| Flag | Description |
|------|-------------|
| Accessible | Clear language, inclusive explanations |
| Visual-heavy | Tables, diagrams, structured layouts |
| Technical | Precise terminology, formal structure |
| Conversational | Natural instructor-style tone |
| Humor | Light, intelligent humor while maintaining rigor |

---

## Environment Variables

```env
# Authentication
FACULTY_PASSWORD=your-shared-password

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (for DALL-E)
OPENAI_API_KEY=sk-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Server
PORT=3001
NODE_ENV=development
```

---

## Development Phases

### Phase 1: Core MVP
- [ ] Project scaffolding (Vite + Express)
- [ ] Password authentication
- [ ] Configuration panel UI
- [ ] Basic chat interface
- [ ] Claude API integration
- [ ] HTML preview pane
- [ ] Copy to clipboard

### Phase 2: Image Support
- [ ] Image URL input
- [ ] File upload to Cloudinary
- [ ] AI image generation (DALL-E)
- [ ] Image insertion into generated HTML

### Phase 3: Polish
- [ ] Loading states and error handling
- [ ] Responsive layout for desktop
- [ ] "New Page" reset functionality
- [ ] Help/instructions modal
- [ ] Edge case handling

### Phase 4: Deployment
- [ ] Production build configuration
- [ ] Environment variable setup
- [ ] Deploy to Vercel/Railway
- [ ] Testing with real faculty

---

## Generated HTML Template Structure

The agent will generate HTML following this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Topic Title]</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles if needed */
    </style>
</head>
<body class="bg-white text-gray-900">
    <article class="max-w-4xl mx-auto px-6 py-8">

        <header class="mb-8">
            <h1 class="text-3xl font-bold">[Topic Title]</h1>
            <p class="text-gray-600 mt-2">[Brief description or learning objectives]</p>
        </header>

        <main class="prose prose-lg max-w-none">
            <!-- Content sections generated based on depth level -->
        </main>

    </article>

    <script>
        // Interactive elements if needed
    </script>
</body>
</html>
```

---

## Next Steps

1. Review and approve this plan
2. Set up the project structure
3. Implement Phase 1 (Core MVP)
4. Test with sample topics
5. Add image support (Phase 2)
6. Polish and deploy (Phases 3-4)
