# 🕌 Prayer Tracker - GitHub + Render Deployment Guide

This guide will help you deploy your Prayer Tracker Mini App using GitHub and Render for FREE 24/7 hosting!

## 📋 Prerequisites

- GitHub account (create at https://github.com)
- Render account (create at https://render.com - sign up with GitHub)
- Your Telegram bot token from @BotFather

## 🚀 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `prayer-tracker-bot`
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README
6. Click **"Create repository"**

### Step 2: Upload Your Code to GitHub

You have two options:

#### Option A: Upload via GitHub Web Interface (Easiest)

1. On your new repository page, click **"uploading an existing file"**
2. **Drag and drop ALL these files**:
   - `main.py`
   - `server.py`
   - `requirements.txt`
   - `Procfile`
   - `render.yaml`
   - `.gitignore`
   - `SETUP_GUIDE.md` (optional)

3. **Create the `static` folder**:
   - After uploading the files above, click **"Add file"** → **"Create new file"**
   - In the name field, type: `static/index.html`
   - Copy and paste the content from your `index.html` file
   - Click **"Commit new file"**
   
4. **Upload the other static files**:
   - Navigate to the `static` folder
   - Click **"Add file"** → **"Upload files"**
   - Upload `style.css` and `app.js`

5. **Commit all changes**:
   - Add commit message: "Initial commit - Prayer Tracker Mini App"
   - Click **"Commit changes"**

#### Option B: Using Git Command Line

If you're comfortable with command line:

```bash
# Navigate to your project folder
cd prayer-tracker-bot

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Prayer Tracker Mini App"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/prayer-tracker-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy Web Service on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** 
4. Authorize Render to access your GitHub
5. Select your **"prayer-tracker-bot"** repository
6. Configure the service:

   **Basic Settings:**
   - Name: `prayer-tracker-web`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: (leave blank)
   - Runtime: `Python 3`
   
   **Build & Deploy:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python server.py`
   
   **Instance Type:**
   - Select **"Free"** plan
   
7. Click **"Advanced"** and add Environment Variables:
   - Click **"Add Environment Variable"**
   - Key: `PORT` → Value: `10000`
   
8. Click **"Create Web Service"**

9. **IMPORTANT**: After deployment completes, copy your web service URL. It will look like:
   ```
   https://prayer-tracker-web.onrender.com
   ```

### Step 4: Deploy Bot Worker on Render

1. Still on Render dashboard, click **"New +"** → **"Background Worker"**
2. Select your **"prayer-tracker-bot"** repository again
3. Configure the worker:

   **Basic Settings:**
   - Name: `prayer-tracker-bot`
   - Region: Same as web service
   - Branch: `main`
   - Runtime: `Python 3`
   
   **Build & Deploy:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
   
   **Instance Type:**
   - Select **"Free"** plan

4. Click **"Advanced"** and add Environment Variables:
   - Click **"Add Environment Variable"**
   
   **Add these two variables:**
   
   a) `TELEGRAM_BOT_TOKEN`
      - Value: Your token from @BotFather (e.g., `123456789:ABCdef...`)
   
   b) `WEBAPP_URL`
      - Value: Your web service URL from Step 3
      - Example: `https://prayer-tracker-web.onrender.com`

5. Click **"Create Background Worker"**

### Step 5: Configure Bot Menu Button

1. Open Telegram and find **@BotFather**
2. Send: `/setmenubutton`
3. Select your bot: **@Track_prayer_bot**
4. Send button text: `Open Prayer Tracker`
5. Send your webapp URL: `https://prayer-tracker-web.onrender.com`

### Step 6: Test Your Bot! 🎉

1. Open Telegram
2. Search for **@Track_prayer_bot**
3. Send `/start`
4. Click **"Open Prayer Tracker"** button
5. The Mini App should open inside Telegram!

## 🔍 Verify Deployment

### Check Web Service:
- Visit your Render dashboard
- Click on "prayer-tracker-web"
- Status should show **"Live"** with a green dot
- Click the URL to open the web app (should show the prayer tracker interface)

### Check Bot Worker:
- Click on "prayer-tracker-bot" in Render dashboard
- Status should show **"Live"** with a green dot
- Check Logs tab - you should see "✅ Bot is running!"

## 📊 Monitor Your Services

**Render Dashboard:**
- View logs for both services
- Monitor uptime and performance
- Both services auto-restart if they crash

**Free Tier Limits:**
- Web services sleep after 15 minutes of inactivity
- Services spin up when accessed (may take 30-60 seconds first time)
- 750 hours/month free (enough for 24/7 operation)

## 🔧 Troubleshooting

### Bot not responding:
1. Check Render logs for "prayer-tracker-bot"
2. Verify `TELEGRAM_BOT_TOKEN` is set correctly
3. Make sure bot is "Live" status

### Mini App won't open:
1. Check that "prayer-tracker-web" is "Live"
2. Verify `WEBAPP_URL` in bot worker matches actual web service URL
3. Test the web URL directly in browser first

### App loads but doesn't save data:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Telegram Cloud Storage works only inside Telegram app

### Services keep sleeping:
1. This is normal for free tier
2. First load takes 30-60 seconds to wake up
3. Upgrade to paid plan for always-on service

## 🔄 Updating Your App

When you want to make changes:

1. **Update files on GitHub**:
   - Edit files directly on GitHub, OR
   - Use git to push changes:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. **Render auto-deploys**:
   - Render automatically detects GitHub changes
   - Both services will rebuild and restart
   - Check deploy status in Render dashboard

## 💰 Cost

**100% FREE** with these limitations:
- Web service sleeps after 15 min inactivity
- 750 hours/month (enough for one 24/7 service)
- Services share resources

**Paid Plan ($7/month per service):**
- Always-on (no sleeping)
- Better performance
- More resources

## 📁 Required Files Checklist

Make sure these files are in your GitHub repository:

```
✅ main.py
✅ server.py
✅ requirements.txt
✅ Procfile
✅ render.yaml (optional but helpful)
✅ .gitignore
✅ static/
   ✅ index.html
   ✅ style.css
   ✅ app.js
```

## 🆘 Need Help?

**Common Issues:**

1. **"Application failed to respond"**
   - Check environment variables are set
   - Verify build command completed successfully
   - Check logs for Python errors

2. **"Module not found"**
   - Ensure requirements.txt is in root directory
   - Check build logs for pip install errors

3. **Bot responds but Mini App won't open**
   - Verify WEBAPP_URL exactly matches web service URL
   - Don't include trailing slash
   - Test web URL in browser first

## 🎯 Next Steps

Once deployed:
1. Test all features in Telegram
2. Log some prayers to test data saving
3. Check analytics and qaza tracker
4. Share with friends! 🕌

---

**Congratulations! Your Prayer Tracker is now live 24/7!** 🎉

May Allah accept your prayers! 🤲
