# Deployment Instructions for TrainMyAgent Widget

## 🚀 Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `trainmyagent-widget`
   - Description: "AI-powered widget for capturing automation needs with OpenAI integration"
   - Make it Public or Private as needed
   - DON'T initialize with README (we already have one)

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trainmyagent-widget.git
   git branch -M main
   git push -u origin main
   ```

## 📦 What to Share with Your Dev

Share the GitHub repo link. The dev will get:

1. **Complete widget code** (`agent-widget.js`)
2. **API endpoint** (`api/get-response.js`) 
3. **Test pages** for development
4. **Documentation** with integration instructions

## 🔑 Important for Your Dev

1. **Environment Variables**:
   - They need to set `OPENAI_API_KEY` in their environment
   - You should remove your API key from `.env` before pushing
   - `.env` is already in `.gitignore` so it won't be pushed

2. **Configuration**:
   - Update Calendly URL in `agent-widget.js`
   - Update email address in `agent-widget.js`

3. **Deployment Options**:
   - **Vercel**: Just connect the GitHub repo
   - **Netlify**: Add as a new site from Git
   - **Any static host**: For widget only (no API)

## 🛡️ Security Note

Before pushing, let's remove your API key from tracking:
```bash
git rm --cached .env
echo "# Never commit API keys" >> .env
```

Your `.env` file is already in `.gitignore`, so it won't be pushed to GitHub.