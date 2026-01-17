# Project Summary - Instructional Page Builder

## What This Project Does

The Instructional Page Builder is an AI-powered web application that allows faculty members to create educational HTML pages through natural conversation. Faculty describe what they want to teach, and the system generates complete, self-contained HTML pages ready to paste into Blackboard LMS.

### The "Magic" for Faculty

1. Faculty logs in with a shared password
2. Describes what they want to teach (e.g., "JavaScript async/await")
3. Selects how deep/technical it should be (Level 0-4)
4. Optionally chooses style preferences (accessible, visual, conversational, etc.)
5. System generates a complete instructional page in ~20 seconds
6. Faculty can refine it by saying things like:
   - "Add more examples"
   - "Make this simpler"
   - "Generate a diagram showing X"
   - "Change the header color to blue"
7. Copies the HTML and pastes it into Blackboard

**No coding required. No design skills needed. Just conversation.**

---

## Documents Created

You now have complete planning documentation:

### 1. PLAN.md
**What it is:** Master specification document

**Key sections:**
- Core features overview
- Technical stack (React, Express, Claude, DALL-E, Cloudinary)
- Complete file/folder structure
- API endpoint specifications
- UI/UX wireframes
- Depth level definitions (0-4)
- Style flag descriptions
- Development phases (MVP → Images → Polish → Deploy)

**Use this for:** Understanding the overall architecture and what needs to be built

---

### 2. IMPLEMENTATION_GUIDE.md
**What it is:** Step-by-step build instructions

**Key sections:**
- Project setup commands
- Environment configuration
- Complete backend implementation (with code)
- Complete frontend implementation (with code)
- Component architecture
- Testing strategy
- Common patterns

**Use this for:** Actually building the application. Contains real code examples.

---

### 3. server/prompts/system.txt
**What it is:** The "brain" of the AI agent

**Key sections:**
- Agent role definition
- Output format requirements
- Depth level behaviors (0-4)
- Style flag implementations
- HTML template structure
- Image handling rules
- Iteration/editing logic

**Use this for:** Understanding and controlling how the LLM generates pages

---

### 4. EXAMPLE_FLOWS.md
**What it is:** Real conversation examples

**Key sections:**
- 6 complete conversation examples
- Different depth levels demonstrated
- Image generation workflow
- Common interaction patterns
- Edge cases and how agent handles them
- Tips for faculty users

**Use this for:** Understanding how the system should behave in practice

---

### 5. DEPLOYMENT.md
**What it is:** Production deployment guide

**Key sections:**
- Pre-deployment checklist
- 3 deployment options (Vercel, Railway, VPS)
- Environment variable setup
- Post-deployment verification
- Monitoring and cost estimation
- Troubleshooting guide
- Security best practices

**Use this for:** Deploying to production and maintaining the system

---

### 6. README.md
**What it is:** Project overview and quick start

**Key sections:**
- Feature overview
- Quick start instructions
- Usage guide for faculty
- API endpoints summary
- Development commands
- FAQ

**Use this for:** First document to read. Links to all other documentation.

---

### 7. .env.example
**What it is:** Template for environment variables

**Contains:**
- All required API keys with placeholder values
- Configuration options
- Links to where to get API keys

**Use this for:** Setting up your local environment

---

### 8. .gitignore
**What it is:** Files to exclude from version control

**Use this for:** Keeping secrets and build artifacts out of git

---

## Key Technologies

### Frontend
- **React** - UI framework
- **Vite** - Build tool (fast, modern)
- **Tailwind CSS** - Styling

### Backend
- **Node.js + Express** - Server
- **Anthropic Claude API** - Page generation and content authoring
- **OpenAI DALL-E 3** - AI image generation
- **Cloudinary** - Image hosting (free tier)

### Why These Choices?

- **Claude (Anthropic)**: Excellent at following complex instructions, generating structured content
- **DALL-E 3 (OpenAI)**: Best quality for educational images and diagrams
- **React + Vite**: Fast development, modern tooling
- **Tailwind CSS**: Rapid styling, easy to use in generated HTML too
- **Cloudinary**: Reliable image hosting with free tier sufficient for educational use

---

## How the System Works (Technical Flow)

```
┌──────────┐
│  Faculty │
│  Browser │
└────┬─────┘
     │
     │ 1. Enters topic, depth level, style flags
     │
     ▼
┌────────────────┐
│  React Client  │ ← Shows chat interface + live preview
└────────┬───────┘
         │
         │ 2. POST /api/generate with config
         │
         ▼
┌────────────────┐
│ Express Server │
└────────┬───────┘
         │
         │ 3. Builds prompt from config + system prompt
         │
         ▼
┌──────────────────┐
│  Claude API      │ ← Generates HTML page
│  (Anthropic)     │
└────────┬─────────┘
         │
         │ 4. Returns: message + complete HTML
         │
         ▼
┌────────────────┐
│  React Client  │ ← Displays in iframe preview
└────────────────┘
         │
         │ 5. Faculty clicks "Copy HTML"
         │
         ▼
    Clipboard → Blackboard LMS
```

### Image Generation Flow

```
Faculty: "Generate a diagram showing X"
     │
     ▼
POST /api/images/generate
     │
     ▼
DALL-E 3 generates image
     │
     ▼
Upload to Cloudinary (permanent URL)
     │
     ▼
Return URL to client
     │
     ▼
Faculty: "Add it to the page"
     │
     ▼
POST /api/generate (with image URL)
     │
     ▼
Claude generates HTML with <img> tag
```

---

## Depth Levels Explained

| Level | Name | Example Topic | Output |
|-------|------|---------------|--------|
| **0** | Minimalist | "CSS Flexbox" | Clean reference table, no explanation |
| **1** | Introductory | "What is a variable" | Simple explanation, no code, assumes zero knowledge |
| **2** | Intermediate | "JavaScript Promises" | Explains how/why, includes code examples |
| **3** | Advanced | "RESTful API Design" | Professional depth, best practices, production code |
| **4** | Graduate | "Complexity Theory" | Theoretical analysis, formal notation, academic rigor |

**Key rule:** The agent NEVER mixes levels. If you choose Level 1, you get Level 1 content even if Level 3 would be "better."

---

## Cost Breakdown

Based on light usage (100 pages/month, 50 AI-generated images):

| Service | Cost/Month | Notes |
|---------|-----------|-------|
| Anthropic API | ~$1.50 | $0.015 per page generation |
| OpenAI API | ~$2.00 | $0.04 per image |
| Cloudinary | $0 | Free tier: 25GB storage |
| Vercel Hosting | $0 | Free tier sufficient |
| **Total** | **~$3.50** | Scales linearly with usage |

For heavy usage (500 pages, 200 images): ~$17.50/month

---

## Next Steps - Building the Project

### Phase 1: Core MVP (Week 1)
1. Set up project structure (client + server)
2. Implement authentication (password gate)
3. Build configuration panel
4. Integrate Claude API for generation
5. Create chat interface
6. Build preview pane
7. Add copy/download buttons

**Goal:** Faculty can create and copy basic pages

---

### Phase 2: Image Support (Week 2)
1. Add image URL input
2. Implement file upload to Cloudinary
3. Integrate DALL-E for AI generation
4. Update system prompt for image handling

**Goal:** Faculty can add and generate images

---

### Phase 3: Polish (Week 3)
1. Loading states and error handling
2. UI polish (animations, better styling)
3. "New Page" functionality
4. Help/instructions modal
5. Edge case handling

**Goal:** Production-ready UX

---

### Phase 4: Deployment (Week 4)
1. Set up production environment variables
2. Deploy to Vercel/Railway
3. Test with real faculty
4. Monitor costs
5. Iterate based on feedback

**Goal:** Live, usable by faculty

---

## What Makes This Unique

### Compared to GPT/ChatGPT:
- ✅ Controlled output format (always complete HTML)
- ✅ Strict depth level adherence
- ✅ Built-in preview and export
- ✅ Designed for educational content specifically
- ✅ Faculty-friendly interface

### Compared to Website Builders (Wix, Squarespace):
- ✅ Single-file output (works in Blackboard)
- ✅ Conversational creation (no drag-drop learning)
- ✅ Educational focus (depth levels, style flags)
- ✅ AI-powered content generation
- ✅ Free/low-cost for institutions

### Compared to Traditional LMS Tools:
- ✅ Much more powerful content generation
- ✅ AI assistance for images and layout
- ✅ Natural language refinement
- ✅ Professional design automatically

---

## Potential Issues and Solutions

### Issue: Faculty requests exceed depth level
**Example:** Level 1 user asks for "detailed implementation code"

**Solution:** Agent asks if they want to increase depth level, or provides Level 1-appropriate alternative

---

### Issue: Generated HTML too large for Blackboard
**Solution:** Blackboard typically handles 1-2MB HTML easily. If needed, add warning at 500KB and suggest splitting into multiple pages.

---

### Issue: Faculty wants interactive quiz
**Solution:** Agent offers simple reveal-on-click Q&A sections instead of complex JavaScript quizzes

---

### Issue: API costs spike
**Solution:** Implement rate limiting (see DEPLOYMENT.md). Monitor usage dashboards.

---

### Issue: Images don't load in Blackboard
**Solution:** All images hosted on Cloudinary (external URLs), which Blackboard supports. Verify Cloudinary URLs are permanent.

---

## Success Metrics

After deployment, measure:

1. **Adoption**: How many faculty use it?
2. **Usage**: How many pages created per month?
3. **Iteration**: Average refinement messages per page (should be 2-4)
4. **Satisfaction**: Faculty feedback (survey)
5. **Cost**: Actual API costs vs. estimates
6. **Quality**: Student feedback on generated pages

---

## Future Enhancements (Not in Initial Build)

### Could Add Later:
- User accounts (track individual faculty usage)
- Templates (pre-configured pages for common topics)
- Export to Markdown/PDF
- Save/load previous sessions
- Collaboration (share pages with colleagues)
- Analytics (track page views in Blackboard)
- Quiz generator with auto-grading
- Multi-language support

**Note:** Start simple. Add features based on real usage patterns.

---

## Timeline Estimate

| Phase | Duration | Key Deliverable |
|-------|----------|----------------|
| Setup & Auth | 1-2 days | Working login |
| Core Generation | 3-4 days | Basic page creation |
| Chat Interface | 2-3 days | Conversation + preview |
| Image Support | 2-3 days | Upload + AI generation |
| Polish | 2-3 days | Error handling, UX |
| Deployment | 1-2 days | Live on Vercel/Railway |
| Testing | 2-3 days | Faculty testing + fixes |
| **Total** | **2-3 weeks** | Production-ready |

**Recommendation:** Build in sprints, test frequently with real faculty.

---

## Questions to Answer Before Building

1. ✅ **APIs confirmed:** Anthropic for generation, OpenAI for images
2. ✅ **Deployment preference:** Flexible (Vercel recommended)
3. ✅ **Authentication:** Simple shared password
4. ✅ **Session persistence:** None (ephemeral)
5. ✅ **Mobile support:** Not needed (Blackboard handles it)

All questions answered - ready to build!

---

## Quick Reference - File Locations

| What You Need | File Location |
|---------------|---------------|
| System prompt | `server/prompts/system.txt` |
| API endpoints | `server/routes/` |
| React components | `client/src/components/` |
| Environment vars | `.env` (copy from `.env.example`) |
| Full architecture | `PLAN.md` |
| Build instructions | `IMPLEMENTATION_GUIDE.md` |
| Usage examples | `EXAMPLE_FLOWS.md` |
| Deployment guide | `DEPLOYMENT.md` |

---

## Contact / Support

When building or deploying, refer to:
- **Technical issues:** IMPLEMENTATION_GUIDE.md troubleshooting
- **Deployment problems:** DEPLOYMENT.md troubleshooting
- **Understanding behavior:** EXAMPLE_FLOWS.md
- **Architecture questions:** PLAN.md

---

## Final Checklist Before Building

- [x] All planning documents created
- [x] System prompt defined
- [x] API strategy confirmed (Anthropic + OpenAI)
- [x] Architecture designed
- [x] File structure planned
- [x] Deployment strategy chosen
- [x] Cost estimated
- [x] Example flows documented
- [ ] **Ready to start coding!**

---

**You now have everything needed to build this application. Good luck!**
