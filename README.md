# 🕌 Prayer Tracker - Telegram Mini App

A comprehensive Islamic prayer tracking application built as a Telegram Mini App. Track your 5 daily prayers, monitor streaks, manage qaza debt, and view detailed analytics - all inside Telegram!

## ✨ Features

- 📝 **Daily Prayer Logging** - Track all 5 prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) with 4 status options:
  - 🔵 On-Time - Prayed at proper time
  - 🟢 Jamat - Prayed in congregation  
  - 🟣 Qaza - Made up late
  - 🔴 Missed - Not prayed (adds to debt)

- 🔥 **Streak Counter** - Track consecutive days of praying all 5 prayers with milestone celebrations

- 📿 **Qaza Debt Tracker** - Automatically tracks missed prayers and helps you make them up

- 📊 **Prayer Analytics** - View detailed statistics about your prayer habits

- 📈 **Prayer Heatmap** - Year-view visualization of your prayer activity (coming soon)

- 📅 **Date Navigation** - Browse and log prayers for any past date

- ☁️ **Cloud Storage** - All data stored securely in Telegram Cloud Storage

- 🌙 **Dark Mode** - Automatic theme switching based on Telegram settings

- 📱 **Mobile-First** - Optimized for mobile devices

## 🤖 Bot Commands

- `/start` - Welcome message and open Mini App
- `/track` - Quick access to today's prayer logging
- `/stats` - View your prayer statistics
- `/heatmap` - View yearly prayer heatmap
- `/qaza` - Manage qaza debt tracker
- `/help` - Show help guide

## 🚀 Deployment

This app is designed to be deployed on:
- **GitHub** - Code repository
- **Render** - Free hosting for bot and web app

See [GITHUB_RENDER_GUIDE.md](GITHUB_RENDER_GUIDE.md) for detailed deployment instructions.

## 🛠️ Technology Stack

- **Backend**: Python with python-telegram-bot
- **Web Framework**: Flask
- **Frontend**: HTML, CSS, JavaScript
- **Storage**: Telegram Cloud Storage API
- **Hosting**: Render (free tier)

## 📁 Project Structure

```
prayer-tracker-bot/
├── main.py              # Telegram bot
├── server.py            # Flask web server
├── requirements.txt     # Python dependencies
├── Procfile            # Render deployment config
├── render.yaml         # Render services config
└── static/
    ├── index.html      # Mini App HTML
    ├── style.css       # Styles with dark mode
    └── app.js          # App logic + Telegram WebApp API
```

## 🔐 Environment Variables

Required environment variables:

- `TELEGRAM_BOT_TOKEN` - Your bot token from @BotFather
- `WEBAPP_URL` - URL where the web app is hosted
- `PORT` - Port for web server (default: 10000)

## 📝 License

This project is open source and available for anyone to use and modify.

## 🤲 May Allah Accept Your Prayers!

---

**Live Bot**: [@Track_prayer_bot](https://t.me/Track_prayer_bot)

**Developer**: Built with ❤️ for the Muslim community
