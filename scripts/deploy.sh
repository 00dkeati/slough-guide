#!/bin/bash

# Slough Guide Deployment Script
echo "🚀 Slough Guide Deployment Helper"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
else
    echo "⚠️  .env.local file not found"
    echo "   Please create it with your environment variables"
fi

# Check if git is initialized
if [ -d ".git" ]; then
    echo "✅ Git repository initialized"
    
    # Check if remote is set
    if git remote get-url origin >/dev/null 2>&1; then
        echo "✅ Git remote origin is set"
    else
        echo "⚠️  Git remote origin not set"
        echo "   Run: git remote add origin https://github.com/YOUR_USERNAME/slough-guide.git"
    fi
else
    echo "❌ Git repository not initialized"
fi

# Check if all changes are committed
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ All changes committed"
else
    echo "⚠️  Uncommitted changes detected"
    echo "   Run: git add . && git commit -m 'Your commit message'"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Create GitHub repository: https://github.com/new"
echo "2. Push code: git push -u origin main"
echo "3. Set up Google Cloud Console and get API key"
echo "4. Deploy to Vercel: https://vercel.com/new"
echo "5. Configure Vercel KV database"
echo "6. Set environment variables in Vercel"
echo "7. Run initial data fetch"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🔗 Useful links:"
echo "   - Google Cloud Console: https://console.cloud.google.com/"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - GitHub: https://github.com/new"
echo ""
echo "Good luck with your deployment! 🎉"
