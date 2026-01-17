---
description: Start development servers for both client and server with proper error handling and verification
allowed-tools: Bash(npm:*), Bash(cd:*), Read
---

# Start Development Environment

Let me start the development environment for you.

## Instructions

1. **Verify package.json files exist**
   - Check `./package.json` for root workspace
   - Check `./client/package.json` for frontend
   - Check `./server/package.json` for backend

2. **Check if .env file exists**
   - Read `.env` to verify required API keys are set
   - Warn if any critical keys are missing (ANTHROPIC_API_KEY, OPENAI_API_KEY, FACULTY_PASSWORD)

3. **Install dependencies if needed**
   - Check if `node_modules` exists in root, client, and server
   - Run `npm install` if any are missing

4. **Start development servers**
   - Run `npm run dev` from root directory
   - This starts both client (port 5173) and server (port 3001) concurrently
   - Monitor output for errors

5. **Provide summary**
   - Show what URLs are available:
     - Client: http://localhost:5173
     - Server: http://localhost:3001
     - Server Health: http://localhost:3001/health
   - List any warnings or issues
   - Remind about required API keys if missing

## Expected Output

```
✓ Dependencies installed
✓ Environment variables configured
✓ Starting development servers...

Client: http://localhost:5173
Server: http://localhost:3001
Health: http://localhost:3001/health

Press Ctrl+C to stop servers
```

## Troubleshooting

If servers fail to start:
- Check if ports 5173 or 3001 are already in use
- Verify .env file has required keys
- Check for syntax errors in code
- Review error logs and suggest fixes
