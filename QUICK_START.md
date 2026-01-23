# Quick Start Guide 🚀

**Your Song Identifier App is ready to deploy!** Follow these steps in order to get it live and start getting Google traffic.

---

## Step 1: Get a Domain (Optional but Recommended)
**Cost**: ~$10-15/year

Purchase from:
- Namecheap.com
- Porkbun.com
- Google Domains

**Recommended domain ideas**:
- songidfinder.com
- findsongfromvideo.com
- videosongfinder.com
- quicksongid.com

**Alternative**: Use free subdomain from Railway/Vercel (e.g., song-finder.up.railway.app)

---

## Step 2: Update All Domain URLs
**Find and replace** `yourdomain.com` with your actual domain in these files:

```bash
cd /Users/oscmm/song-identifier-app

# Files to update:
# - client/index.html
# - client/public/sitemap.xml
# - client/public/*.html (all landing pages)
# - GITHUB_README.md
# - MEDIUM_ARTICLE.md
```

Use your code editor's "Find in Files" feature:
1. Find: `yourdomain.com`
2. Replace: `your-actual-domain.com`
3. Replace All

---

## Step 3: Create GitHub Repository

```bash
cd /Users/oscmm/song-identifier-app

# Initialize git (if not already done)
git init

# Copy README
cp GITHUB_README.md README.md

# Add all files
git add .

# Commit
git commit -m "Initial commit: Song Identifier App with SEO optimization"

# Create GitHub repo at github.com
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/song-identifier-app.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Railway (Easiest Option)

### 4.1 Sign Up
1. Go to https://railway.app
2. Sign up with GitHub
3. You get $5 free credit/month

### 4.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `song-identifier-app` repo
4. Railway auto-detects Node.js
5. Go to Settings → Add Variables:
   ```
   PORT=3001
   AUDD_API_KEY=85f2caba7c4fcb7f8d3b8a8a9a3a42b5
   TEMP_AUDIO_PATH=./temp
   RATE_LIMIT_MAX_REQUESTS=100
   NODE_ENV=production
   ```
6. Go to Settings → Set start command: `cd server && npm start`
7. Railway will provide a URL (e.g., `https://song-backend.railway.app`)
8. **Copy this URL** - you'll need it for frontend

### 4.3 Deploy Frontend
1. In same Railway project, click "New Service"
2. Select same GitHub repo
3. Go to Settings → Set root directory: `client`
4. Set build command: `npm run build`
5. Set start command: `npm run preview`
6. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url-from-above.railway.app
   ```
7. Railway provides frontend URL

### 4.4 Update CORS
1. Go back to your code
2. Edit `/server/src/server.ts`
3. Find `allowedOrigins` array
4. Add your frontend Railway URL:
   ```typescript
   const allowedOrigins = [
     'http://localhost:5173',
     'https://your-frontend.railway.app',
   ];
   ```
5. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```
6. Railway auto-deploys

### 4.5 Connect Custom Domain (Optional)
1. In Railway, go to your frontend service
2. Settings → Domains → Add Custom Domain
3. Enter your domain
4. Add CNAME record in your domain registrar:
   - Host: `@` or `www`
   - Value: provided by Railway
5. Wait 5-60 minutes for DNS propagation

---

## Step 5: Submit to Google Search Console

### 5.1 Add Property
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Enter your domain URL
4. Verify ownership:
   - **Option A**: Download HTML file, upload to `/client/public/`
   - **Option B**: Add DNS TXT record (if you own domain)

### 5.2 Submit Sitemap
1. Once verified, go to "Sitemaps" in left menu
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Google will start crawling your site within 24-48 hours

### 5.3 Request Indexing
1. Go to "URL Inspection" in Search Console
2. Enter your homepage URL
3. Click "Request Indexing"
4. Repeat for 2-3 main landing pages:
   - `/tiktok-song-finder.html`
   - `/instagram-reel-music-finder.html`
   - `/find-song-from-video.html`

---

## Step 6: Publish Backlink Content (Same Day)

### 6.1 Medium Article
1. Create account at https://medium.com
2. Click "Write"
3. Copy content from `MEDIUM_ARTICLE.md`
4. Paste and format
5. Add your app link throughout article
6. Add tags: `music`, `webdev`, `react`, `typescript`, `tools`
7. Publish

### 6.2 Dev.to Article
1. Create account at https://dev.to
2. Click "Create Post"
3. Copy same content from Medium
4. Add canonical URL (Medium article URL) if you want
5. Tags: `#webdev` `#typescript` `#react` `#javascript`
6. Include app link
7. Publish

### 6.3 Share on Social Media
- Twitter: "Built a free tool to identify songs from any video URL. Works with TikTok, Instagram, YouTube. Check it out: [your link]"
- LinkedIn: Professional post about building the tool
- Reddit: Share on r/SideProject, r/webdev (read rules first!)

---

## Step 7: Submit to Directories (Week 1)

### Free Directory Listings
1. **AlternativeTo** (alternativeto.net)
   - Submit as alternative to "Shazam"
   - Category: Music & Audio Tools
   - Include your app link

2. **Product Hunt** (producthunt.com)
   - Wait 1-2 weeks after launch for stability
   - Then submit as new product
   - Prepare screenshots, description
   - Launch on Tuesday-Thursday for best results

3. **Indie Hackers** (indiehackers.com)
   - Share your story in "Show IH"
   - Include technical details

---

## Step 8: Monitor & Improve (Week 1+)

### Daily Tasks (First Week)
- [ ] Check Google Search Console for indexing progress
- [ ] Monitor Railway logs for errors
- [ ] Test app functionality
- [ ] Check if pages are being indexed (search: `site:yourdomain.com`)

### Weekly Tasks
- [ ] Review Search Console "Performance" tab for queries
- [ ] Check which landing pages get impressions
- [ ] Add more content to successful pages
- [ ] Fix any crawl errors

### Monthly Tasks
- [ ] Analyze traffic sources
- [ ] Create new landing pages for trending keywords
- [ ] Write blog post about music discovery
- [ ] Reach out to music blogs for backlinks

---

## Expected Timeline

**Day 1-3**: Deployment and setup complete
**Day 3-7**: Google starts indexing pages
**Week 2-4**: First organic impressions appear
**Month 1**: 10-50 organic visitors/day
**Month 2**: 50-200 organic visitors/day
**Month 3**: 200-500+ organic visitors/day

---

## Troubleshooting

### "Site not indexed after 1 week"
- Check robots.txt is accessible
- Verify sitemap submitted correctly
- Request indexing manually for main pages
- Ensure no "noindex" tags in HTML

### "Backend errors in Railway"
- Check logs in Railway dashboard
- Verify all environment variables set
- Test API endpoint directly
- Ensure yt-dlp and ffmpeg available (Railway includes both)

### "CORS errors"
- Update ALLOWED_ORIGINS in server.ts
- Ensure frontend URL matches exactly (with/without trailing slash)
- Redeploy backend after changes

### "Songs not being identified"
- Check AudD API key is valid
- Verify you haven't exceeded API limits (300/month free)
- Test with well-known songs first
- Check if yt-dlp successfully downloaded audio (check logs)

---

## What's Next After Launch?

### Immediate (Week 1-2)
1. Set up Google Analytics or Plausible for traffic tracking
2. Add affiliate links to Spotify/Apple Music results
3. Create 5 more landing pages for long-tail keywords
4. Join music/tech communities and share (not spam)

### Short Term (Month 1-3)
1. Add user accounts for history tracking
2. Implement premium tier ($5-10/month)
3. Create browser extension
4. Build email list with newsletter signup
5. Write 10 SEO blog posts

### Long Term (Month 3-6)
1. Launch on Product Hunt
2. Reach out to tech blogs for features
3. Create YouTube tutorials (video SEO)
4. Build API for developers ($50-100/month)
5. Add mobile apps

---

## Need Help?

**Common Questions**:
- Deployment issues → Check Railway/Render docs
- SEO questions → Check Google Search Console help
- Technical bugs → Review application logs
- API issues → Verify environment variables

**Resources**:
- Railway Docs: https://docs.railway.app
- Google Search Console: https://search.google.com/search-console
- AudD API Docs: https://audd.io/

---

## 🎉 You're Ready!

Follow Steps 1-7 in order, and you'll be live within a few hours. Google will start indexing within 1-2 weeks, and organic traffic will grow from there.

**Remember**: SEO is a marathon, not a sprint. Consistency matters more than perfection. Ship it, monitor it, improve it.

Good luck! 🚀
