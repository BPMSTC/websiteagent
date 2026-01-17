# Deployment Guide

This document covers deploying the Instructional Page Builder to production.

---

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set:

- [ ] `FACULTY_PASSWORD` - Shared password for faculty access
- [ ] `ANTHROPIC_API_KEY` - Claude API key for page generation
- [ ] `OPENAI_API_KEY` - OpenAI API key for DALL-E image generation
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary account name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `CLIENT_URL` - Frontend URL (for CORS)
- [ ] `NODE_ENV=production`

### 2. Security Review

- [ ] Password is strong and unique
- [ ] API keys are kept secret (not in code)
- [ ] CORS is configured correctly
- [ ] Rate limiting is considered (optional but recommended)
- [ ] File upload limits are appropriate (5MB default)

### 3. Testing

- [ ] All features tested locally
- [ ] Tested with real API keys
- [ ] Image upload works
- [ ] Image generation works
- [ ] HTML copy/download works
- [ ] Error states display properly
- [ ] Multiple depth levels tested
- [ ] Style flags work correctly

### 4. Build Preparation

- [ ] Frontend builds successfully (`npm run build` in client/)
- [ ] No console errors in production build
- [ ] Environment variables template (`.env.example`) is up to date
- [ ] README.md has setup instructions

---

## Deployment Options

### Option A: Vercel (Recommended for Simplicity)

Vercel is ideal for this stack and offers easy deployment with good free tiers.

#### Backend (Express API)

1. **Create `vercel.json` in project root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
```

2. **Install Vercel CLI:**

```bash
npm install -g vercel
```

3. **Deploy:**

```bash
vercel
```

4. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Redeploy if needed

#### Frontend Environment Variable

Create `client/.env.production`:

```env
VITE_API_URL=https://your-deployment-url.vercel.app/api
```

---

### Option B: Railway

Railway offers a straightforward deployment with good developer experience.

#### Steps:

1. **Create `railway.json`:**

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start --workspace=server",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

2. **Create Railway account and install CLI:**

```bash
npm install -g @railway/cli
railway login
```

3. **Initialize project:**

```bash
railway init
```

4. **Set environment variables:**

```bash
railway variables set FACULTY_PASSWORD=yourpassword
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set OPENAI_API_KEY=sk-...
railway variables set CLOUDINARY_CLOUD_NAME=...
railway variables set CLOUDINARY_API_KEY=...
railway variables set CLOUDINARY_API_SECRET=...
railway variables set NODE_ENV=production
```

5. **Deploy:**

```bash
railway up
```

6. **Deploy frontend separately or use subdomain routing**

---

### Option C: Traditional VPS (DigitalOcean, AWS, etc.)

For more control, use a VPS with PM2 for process management.

#### Server Setup:

1. **Install Node.js (v18+):**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2:**

```bash
npm install -g pm2
```

3. **Clone repository:**

```bash
git clone <your-repo-url>
cd instructional-page-builder
```

4. **Install dependencies:**

```bash
npm install
npm install --workspace=client
npm install --workspace=server
```

5. **Build frontend:**

```bash
npm run build --workspace=client
```

6. **Set up environment variables:**

```bash
cp .env.example .env
nano .env  # Edit with your values
```

7. **Start server with PM2:**

```bash
pm2 start server/index.js --name instructional-builder
pm2 save
pm2 startup  # Follow instructions
```

8. **Set up Nginx as reverse proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve frontend
    location / {
        root /path/to/instructional-page-builder/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable site and restart Nginx:**

```bash
sudo ln -s /etc/nginx/sites-available/instructional-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Set up SSL with Let's Encrypt:**

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment

### 1. Verify Deployment

Test the following:

- [ ] Can access the application at production URL
- [ ] Password authentication works
- [ ] Can create a simple page (Level 1, no images)
- [ ] Can create a page with code examples (Level 2)
- [ ] Can upload an image
- [ ] Can generate an image with AI
- [ ] Copy HTML to clipboard works
- [ ] Download HTML file works
- [ ] Multiple conversations work correctly
- [ ] "New Page" reset works

### 2. Monitor Usage

Set up basic monitoring:

- [ ] Check server logs regularly
- [ ] Monitor API usage/costs:
  - Anthropic API dashboard
  - OpenAI API dashboard
  - Cloudinary dashboard
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

### 3. Usage Limits (Optional but Recommended)

To control costs, consider:

```javascript
// In server/index.js or middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/generate', apiLimiter);
app.use('/api/images/generate', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10 // Limit image generation
}));
```

---

## Cost Estimation

### Anthropic API (Claude)

- Model: claude-sonnet-4-20250514
- Average tokens per generation: ~5,000
- Cost: ~$0.015 per generation
- **100 pages/month ≈ $1.50**

### OpenAI API (DALL-E 3)

- Model: DALL-E 3 (1024x1024, standard)
- Cost: $0.040 per image
- **50 images/month ≈ $2.00**

### Cloudinary

- Free tier: 25GB storage, 25GB bandwidth
- Likely sufficient for educational use
- **$0/month** (on free tier)

### Hosting

- **Vercel:** Free tier likely sufficient
- **Railway:** $5/month for hobby tier
- **VPS:** $5-10/month

### Total Estimated Monthly Cost

Light usage (100 pages, 50 images): **$3.50 - $13.50/month**

---

## Scaling Considerations

### If Usage Grows:

1. **API Costs**
   - Monitor usage in dashboards
   - Consider caching common requests
   - Implement request throttling

2. **Image Storage**
   - Cloudinary free tier handles ~1,000 images
   - Upgrade if needed ($89/month for Pro)

3. **Server Resources**
   - Vercel/Railway auto-scale
   - VPS: upgrade to larger instance

4. **User Management**
   - Consider adding individual faculty accounts
   - Track usage per user
   - Implement quotas if needed

---

## Troubleshooting

### Common Issues:

**1. "Failed to generate content"**
- Check Anthropic API key is valid
- Check API key has sufficient credits
- Review server logs for detailed error

**2. "Failed to generate image"**
- Check OpenAI API key is valid
- Ensure DALL-E 3 is enabled on your account
- Review rate limits

**3. "Failed to upload image"**
- Check Cloudinary credentials
- Verify file size is under 5MB
- Check Cloudinary storage quota

**4. CORS errors**
- Ensure `CLIENT_URL` environment variable is correct
- Check CORS configuration in server

**5. Preview not rendering**
- Check browser console for errors
- Verify HTML is being generated correctly
- Check iframe sandbox settings

---

## Maintenance

### Regular Tasks:

- [ ] Review API usage monthly
- [ ] Check error logs weekly
- [ ] Update dependencies quarterly
- [ ] Review and update system prompt as needed
- [ ] Collect faculty feedback and iterate

### Updates:

```bash
# Update dependencies
npm update
npm update --workspace=client
npm update --workspace=server

# Rebuild and redeploy
npm run build --workspace=client
# Then redeploy using your chosen platform
```

---

## Backup and Recovery

### What to Backup:

1. **Environment variables** (keep secure copy)
2. **System prompt** (`server/prompts/system.txt`)
3. **Cloudinary images** (auto-backed up by Cloudinary)

### Recovery:

If you need to redeploy from scratch:

1. Clone repository
2. Restore `.env` file
3. Deploy using one of the methods above
4. Test functionality

Note: Individual sessions are not persisted, so there's no conversation data to backup.

---

## Security Best Practices

1. **Never commit `.env` file** - Always use `.gitignore`
2. **Rotate passwords regularly** - Update `FACULTY_PASSWORD` periodically
3. **Use HTTPS only** - Configure SSL/TLS
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Monitor access logs** - Watch for unusual patterns
6. **Validate all inputs** - Backend already sanitizes, but review regularly

---

## Support and Documentation

### For Faculty Users:

Create a simple guide covering:
- How to log in
- How to configure a new page
- How to request changes
- How to copy/download HTML
- How to paste into Blackboard

### For Administrators:

Keep this deployment guide accessible for:
- Updating environment variables
- Monitoring costs
- Troubleshooting issues
- Deploying updates

---

## Next Steps After Deployment

1. **Announce to faculty** - Share URL and password
2. **Provide brief training** - 15-minute walkthrough
3. **Collect feedback** - First 2 weeks are critical
4. **Iterate on system prompt** - Adjust based on real usage
5. **Monitor costs** - Ensure within budget
6. **Scale as needed** - Add resources if usage grows

---

## Rollback Plan

If something goes wrong:

1. **Vercel/Railway**: Use dashboard to rollback to previous deployment
2. **VPS**: Keep previous build in separate directory
3. **Environment variables**: Keep backup of working `.env`

Quick rollback command for PM2:

```bash
pm2 stop instructional-builder
cd /path/to/backup
pm2 start server/index.js --name instructional-builder
```
