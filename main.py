#!/usr/bin/env python3
"""
Track Prayer Bot - Telegram Bot with Mini App
Handles bot commands and launches the Prayer Tracker Mini App
"""

import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
)

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
# Your Mini App URL (we'll set this up on Replit)
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-replit-app.repl.co')


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command - Welcome and launch Mini App"""
    user = update.effective_user
    
    welcome_text = f"""
🕌 *Assalamu Alaikum {user.first_name}!*

Welcome to *Track Prayer Bot* - your Islamic prayer tracking companion.

📿 Track your 5 daily prayers
📊 View analytics and streaks  
📈 Monitor your spiritual progress
☁️ All data stored securely in Telegram Cloud

Click the button below to open the Prayer Tracker app:
"""
    
    keyboard = [
        [InlineKeyboardButton("🕌 Open Prayer Tracker", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def track_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /track command - Quick access to today's tracking"""
    keyboard = [
        [InlineKeyboardButton("📝 Log Today's Prayers", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🕌 *Track Your Prayers*\n\nOpen the app to log today's prayers:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /stats command - View analytics"""
    keyboard = [
        [InlineKeyboardButton("📊 View Analytics", web_app=WebAppInfo(url=f"{WEBAPP_URL}#analytics"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📊 *Prayer Statistics*\n\nView your prayer analytics and insights:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def heatmap_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /heatmap command - View year heatmap"""
    keyboard = [
        [InlineKeyboardButton("📈 View Heatmap", web_app=WebAppInfo(url=f"{WEBAPP_URL}#heatmap"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📈 *Prayer Heatmap*\n\nView your yearly prayer activity:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def qaza_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /qaza command - View qaza debt"""
    keyboard = [
        [InlineKeyboardButton("📿 Qaza Tracker", web_app=WebAppInfo(url=f"{WEBAPP_URL}#qaza"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📿 *Qaza Debt Tracker*\n\nManage your missed prayers:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    help_text = """
🕌 *Track Prayer Bot - Help Guide*

*Commands:*
/start - Welcome message and open app
/track - Quick access to today's prayers
/stats - View your prayer statistics
/heatmap - View yearly prayer heatmap
/qaza - Manage qaza debt
/help - Show this help message

*Features:*
📝 Log 5 daily prayers with status
🔥 Track prayer streaks
📊 Detailed analytics and reports
📈 Year-view heatmap
📿 Qaza debt management
📅 Calendar views
💾 Import/Export data

*Prayer Statuses:*
🔵 On-Time - Prayed at proper time
🟢 Jamat - Prayed in congregation
🟣 Qaza - Made up late
🔴 Missed - Not prayed (adds to debt)

All your data is stored securely in Telegram Cloud Storage.

May Allah accept your prayers! 🤲
"""
    
    keyboard = [
        [InlineKeyboardButton("🕌 Open Prayer Tracker", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        help_text,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


def main():
    """Start the bot"""
    if BOT_TOKEN == 'YOUR_BOT_TOKEN_HERE':
        print("❌ Error: Please set TELEGRAM_BOT_TOKEN in Replit Secrets!")
        print("Also set WEBAPP_URL to your Replit app URL")
        return
    
    print("🤖 Starting Track Prayer Bot...")
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("track", track_command))
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("heatmap", heatmap_command))
    application.add_handler(CommandHandler("qaza", qaza_command))
    application.add_handler(CommandHandler("help", help_command))
    
    print("✅ Bot is running!")
    print(f"📱 Mini App URL: {WEBAPP_URL}")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
