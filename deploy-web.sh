#!/bin/bash

# Build the web version
echo "Building web version..."
npx expo export:web

# Add a 404.html for GitHub Pages SPA support
cp web-build/index.html web-build/404.html

# Initialize git in web-build if needed
cd web-build
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch
git push -f https://github.com/YOUR_USERNAME/YOUR_REPO.git master:gh-pages

echo "Deployed to GitHub Pages!"
echo "Your app will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO"