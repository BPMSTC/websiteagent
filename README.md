# Instructional Page Builder

An AI-powered web application that allows faculty members to create educational HTML pages through natural conversation. Faculty describe what they want to teach, and the system generates complete, self-contained HTML pages ready to paste into Blackboard LMS.

## ✨ Features

- **Conversational Interface**: Create instructional pages by describing what you want in plain English
- **5 Depth Levels (0-4)**: From minimalist reference sheets to graduate-level academic content
- **Style Customization**: Choose from accessible, visual-heavy, technical, conversational, or humorous styles
- **AI Image Generation**: Automatically generate educational diagrams and visuals with DALL-E 3
- **Live Preview**: See your page rendered in real-time as you refine it
- **One-Click Export**: Copy HTML to clipboard or download as a file for Blackboard
- **No Coding Required**: Faculty focus on teaching, AI handles the HTML

## 🎯 Perfect For

- Creating quick reference materials for students
- Building custom interactive lessons
- Generating topic explainers with examples
- Producing visual guides with diagrams
- Developing course-specific documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - [Anthropic Claude API](https://console.anthropic.com)
  - [OpenAI API](https://platform.openai.com) (for DALL-E)
  - [Cloudinary](https://cloudinary.com) (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/websiteagent.git
   cd websiteagent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys and settings:
   ```env
   FACULTY_PASSWORD=your-secure-password
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to http://localhost:5173
   - Enter the faculty password
   - Start creating!

## 📖 Usage Guide

### For Faculty

1. **Login** with the shared password
2. **Configure** your page:
   - Enter the topic (e.g., "JavaScript Promises")
   - Select depth level (0-4)
   - Choose style flags (optional)
3. **Chat** with the AI to refine:
   - "Add more examples"
   - "Make this simpler"
   - "Generate a diagram showing X"
   - "Change the header color to blue"
4. **Copy/Download** the final HTML
5. **Paste** into Blackboard LMS

### Depth Levels Explained

| Level | Name | Use Case | Example Topic |
|-------|------|----------|---------------|
| **0** | Minimalist | Quick reference, cheat sheets | CSS Flexbox property table |
| **1** | Introductory | Complete beginners, high school | "What is a variable?" |
| **2** | Intermediate | College CS students | JavaScript Promises with examples |
| **3** | Advanced | Professional developers | RESTful API best practices |
| **4** | Graduate | Academic/theoretical | Complexity theory with proofs |

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Anthropic Claude API (page generation), OpenAI DALL-E 3 (images)
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel-ready (or Railway, VPS)

## 📁 Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # API client
│   └── vite.config.js
├── server/                # Express backend
│   ├── routes/           # API endpoints
│   ├── services/         # API integrations
│   └── prompts/          # AI system prompts
├── .env.example          # Environment template
└── package.json          # Root workspace config
```

## 🔌 API Endpoints

### `POST /api/auth/verify`
Verify faculty password

### `POST /api/generate`
Generate or refine instructional page
- Accepts: conversation history, config (topic, depth, styles), user message
- Returns: assistant message, complete HTML, generated images

### `POST /api/images/upload`
Upload user-provided images to Cloudinary

### `POST /api/images/generate`
Generate AI images with DALL-E 3

## 📚 Documentation

- **[PLAN.md](PLAN.md)** - Complete specification and architecture
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Step-by-step build instructions
- **[EXAMPLE_FLOWS.md](EXAMPLE_FLOWS.md)** - Realistic conversation examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Overview and technical flow
- **[CLAUDE.md](CLAUDE.md)** - Project memory and coding guidelines

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Railway
```bash
railway init
railway up
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including environment setup, security considerations, and troubleshooting.

## 🔐 Security Notes

- Keep `.env` file secure and never commit it
- Use strong passwords for `FACULTY_PASSWORD`
- API keys should never be exposed to the client
- CORS is configured to accept only specified origins
- File uploads are limited to 5MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ❓ FAQ

**Q: Can students use this tool?**  
A: Currently designed for faculty only (password-protected). Students receive the generated HTML pages.

**Q: Does the generated HTML work in other LMS platforms?**  
A: Yes! The HTML is self-contained and should work in Canvas, Moodle, or any platform that accepts HTML content.

**Q: What if I run out of API credits?**  
A: Monitor usage in your Anthropic/OpenAI dashboards. Consider setting usage limits or alerts.

**Q: Can I customize the AI behavior?**  
A: Yes! Edit `server/prompts/system.txt` to adjust how the AI generates content.

**Q: Are there any usage costs?**  
A: Free tier of Cloudinary covers most use cases. Claude and DALL-E charge per API call - monitor your usage.

## 🙏 Acknowledgments

Built with:
- [Anthropic Claude](https://www.anthropic.com) for intelligent content generation
- [OpenAI DALL-E 3](https://openai.com/dall-e-3) for AI image generation
- [Cloudinary](https://cloudinary.com) for reliable image hosting

---

**Ready to create your first instructional page?** Start with `npm run dev` and visit http://localhost:5173!