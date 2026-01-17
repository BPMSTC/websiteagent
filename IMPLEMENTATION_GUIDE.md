# Implementation Guide - Instructional Page Builder

This document provides detailed implementation guidance for building each component of the application.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Environment Configuration](#environment-configuration)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Testing Strategy](#testing-strategy)
6. [Common Patterns](#common-patterns)

---

## Project Setup

### 1. Initialize the Project

```bash
# Create project directory
mkdir instructional-page-builder
cd instructional-page-builder

# Initialize as npm workspace
npm init -y

# Create client and server directories
mkdir client server
```

### 2. Set Up Root Package.json

```json
{
  "name": "instructional-page-builder",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build --workspace=client"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### 3. Initialize Client (Vite + React)

```bash
cd client
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios
```

### 4. Initialize Server (Express)

```bash
cd ../server
npm init -y
npm install express cors dotenv @anthropic-ai/sdk openai cloudinary multer
npm install -D nodemon
```

---

## Environment Configuration

### Create `.env.example`

```env
# Authentication
FACULTY_PASSWORD=changeme

# Anthropic API (for HTML generation)
ANTHROPIC_API_KEY=sk-ant-placeholder

# OpenAI API (for DALL-E image generation)
OPENAI_API_KEY=sk-placeholder

# Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Create `.env` (gitignored)

Copy `.env.example` to `.env` and fill in actual values when deploying.

### Create `.gitignore`

```
node_modules
.env
dist
build
*.log
.DS_Store
```

---

## Backend Implementation

### 1. Server Entry Point (`server/index.js`)

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/images', require('./routes/images'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Authentication Route (`server/routes/auth.js`)

```javascript
const express = require('express');
const router = express.Router();

router.post('/verify', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === process.env.FACULTY_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

module.exports = router;
```

### 3. Generation Route (`server/routes/generate.js`)

```javascript
const express = require('express');
const router = express.Router();
const claudeService = require('../services/claude');
const fs = require('fs').promises;
const path = require('path');

// Load system prompt once at startup
let systemPrompt = '';
(async () => {
  systemPrompt = await fs.readFile(
    path.join(__dirname, '../prompts/system.txt'),
    'utf-8'
  );
})();

router.post('/', async (req, res) => {
  try {
    const { conversation, config, userMessage } = req.body;

    // Build messages array for Claude API
    const messages = [
      ...conversation,
      { role: 'user', content: buildUserMessage(config, userMessage) }
    ];

    // Call Claude API
    const response = await claudeService.generate(systemPrompt, messages);

    // Parse response to extract message and HTML
    const { message, html, imagesNeeded } = parseClaudeResponse(response);

    res.json({
      message,
      html,
      imagesGenerated: [] // Populated if we auto-generate images
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

function buildUserMessage(config, userMessage) {
  // First message: include full config
  if (!userMessage) {
    return `Please create an instructional page with the following configuration:

Topic: ${config.topic}
Depth Level: ${config.depthLevel}
Style Flags: ${config.styleFlags.join(', ') || 'None'}
Available Images: ${config.images.length > 0 ? config.images.map(img => img.url).join(', ') : 'None'}

Generate the HTML page now.`;
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

  return { message, html, imagesNeeded: [] };
}

module.exports = router;
```

### 4. Claude Service (`server/services/claude.js`)

```javascript
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generate(systemPrompt, messages) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: messages
  });

  return response;
}

module.exports = { generate };
```

### 5. Image Routes (`server/routes/images.js`)

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinaryService = require('../services/cloudinary');
const imageGenService = require('../services/imageGen');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image file
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = await cloudinaryService.upload(req.file.buffer);
    res.json({ url });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Generate image with AI
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    // Generate with DALL-E
    const imageUrl = await imageGenService.generate(prompt, style);

    // Upload to Cloudinary for permanent hosting
    const permanentUrl = await cloudinaryService.uploadFromUrl(imageUrl);

    res.json({ url: permanentUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;
```

### 6. Image Generation Service (`server/services/imageGen.js`)

```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generate(prompt, style = 'educational') {
  const stylePrompts = {
    educational: 'Clean, educational illustration style, clear and simple',
    diagram: 'Technical diagram style, clear labels and structure',
    realistic: 'Photorealistic style, professional quality',
    illustration: 'Hand-drawn illustration style, friendly and approachable'
  };

  const fullPrompt = `${prompt}. ${stylePrompts[style] || stylePrompts.educational}`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: fullPrompt,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  });

  return response.data[0].url;
}

module.exports = { generate };
```

### 7. Cloudinary Service (`server/services/cloudinary.js`)

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function upload(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'instructional-pages' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

async function uploadFromUrl(url) {
  const result = await cloudinary.uploader.upload(url, {
    folder: 'instructional-pages'
  });

  return result.secure_url;
}

module.exports = { upload, uploadFromUrl };
```

### 8. Server Package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "cloudinary": "^2.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.26.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.3"
  }
}
```

---

## Frontend Implementation

### 1. Tailwind Configuration (`client/tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. Main Styles (`client/src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

### 3. API Client (`client/src/utils/api.js`)

```javascript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Auth
  verifyPassword: async (password) => {
    const response = await axios.post(`${API_BASE}/auth/verify`, { password });
    return response.data;
  },

  // Generation
  generate: async (conversation, config, userMessage) => {
    const response = await axios.post(`${API_BASE}/generate`, {
      conversation,
      config,
      userMessage
    });
    return response.data;
  },

  // Images
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_BASE}/images/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  generateImage: async (prompt, style) => {
    const response = await axios.post(`${API_BASE}/images/generate`, {
      prompt,
      style
    });
    return response.data;
  }
};
```

### 4. Chat Hook (`client/src/hooks/useChat.js`)

```javascript
import { useState } from 'react';
import { api } from '../utils/api';

export function useChat() {
  const [conversation, setConversation] = useState([]);
  const [currentHtml, setCurrentHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (config, userMessage) => {
    setLoading(true);
    setError(null);

    try {
      // Add user message to conversation if provided
      const newConversation = userMessage
        ? [...conversation, { role: 'user', content: userMessage }]
        : conversation;

      // Call API
      const response = await api.generate(newConversation, config, userMessage);

      // Update conversation with assistant response
      const updatedConversation = [
        ...newConversation,
        { role: 'assistant', content: response.message }
      ];

      setConversation(updatedConversation);
      setCurrentHtml(response.html);

      return response;

    } catch (err) {
      setError(err.message || 'Failed to generate content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setConversation([]);
    setCurrentHtml('');
    setError(null);
  };

  return {
    conversation,
    currentHtml,
    loading,
    error,
    sendMessage,
    reset
  };
}
```

### 5. Clipboard Hook (`client/src/hooks/useClipboard.js`)

```javascript
import { useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  };

  return { copied, copy };
}
```

### 6. App Component (`client/src/components/App.jsx`)

```javascript
import { useState } from 'react';
import AuthGate from './AuthGate';
import ConfigPanel from './ConfigPanel';
import ChatInterface from './ChatInterface';
import PreviewPane from './PreviewPane';
import ExportButtons from './ExportButtons';
import { useChat } from '../hooks/useChat';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [config, setConfig] = useState(null);
  const { conversation, currentHtml, loading, error, sendMessage, reset } = useChat();

  const handleStartSession = (sessionConfig) => {
    setConfig(sessionConfig);
    // Send initial generation request
    sendMessage(sessionConfig, null);
  };

  const handleNewPage = () => {
    reset();
    setConfig(null);
  };

  if (!authenticated) {
    return <AuthGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  if (!config) {
    return <ConfigPanel onStart={handleStartSession} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructional Page Builder</h1>
          <p className="text-sm text-gray-600 mt-1">
            Topic: {config.topic} | Depth: {config.depthLevel} | Flags: {config.styleFlags.join(', ') || 'None'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleNewPage}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            New Page
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r bg-white overflow-hidden flex flex-col">
          <ChatInterface
            conversation={conversation}
            loading={loading}
            error={error}
            onSendMessage={(msg) => sendMessage(config, msg)}
          />
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <PreviewPane html={currentHtml} />
          </div>
          <div className="border-t bg-white p-4">
            <ExportButtons html={currentHtml} topic={config.topic} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 7. Auth Gate Component (`client/src/components/AuthGate.jsx`)

```javascript
import { useState } from 'react';
import { api } from '../utils/api';

export default function AuthGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.verifyPassword(password);
      onAuthenticated();
    } catch (err) {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          Instructional Page Builder
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Faculty Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter faculty password"
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 8. Other Component Stubs

The remaining components follow similar patterns:

- **ConfigPanel.jsx**: Form for topic, depth level, style flags, image uploads
- **ChatInterface.jsx**: Scrollable message list + input field
- **MessageBubble.jsx**: Individual message display (user vs assistant styling)
- **PreviewPane.jsx**: Sandboxed iframe rendering HTML
- **ExportButtons.jsx**: Copy + Download buttons using useClipboard hook
- **DepthSelector.jsx**: Radio cards for levels 0-4 with descriptions
- **StyleFlags.jsx**: Checkbox group for style options
- **ImageUploader.jsx**: Drag-drop zone + URL input

Full implementations available upon request.

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Password authentication works
- [ ] Configuration panel accepts all inputs
- [ ] Initial page generation succeeds
- [ ] Chat interface shows messages correctly
- [ ] Edits trigger regeneration
- [ ] Preview updates after each generation
- [ ] Copy HTML works
- [ ] Download HTML works
- [ ] Image upload succeeds
- [ ] AI image generation works
- [ ] Error handling displays properly
- [ ] "New Page" reset works

### Example Test Topics

1. **Level 1**: "Introduction to Variables in Python"
2. **Level 2**: "Async/Await in JavaScript"
3. **Level 3**: "RESTful API Design Patterns"
4. **Level 4**: "Computational Complexity Theory"

---

## Common Patterns

### Error Handling Pattern

```javascript
try {
  const result = await someAsyncFunction();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  setError(error.message || 'An error occurred');
}
```

### Loading State Pattern

```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someAsyncFunction();
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering Pattern

```javascript
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}
```

---

## Next Steps After Implementation

1. Test locally with `.env` configured
2. Ensure all Phase 1 features work
3. Add image support (Phase 2)
4. Polish UI and error handling (Phase 3)
5. Deploy to production (Phase 4)
