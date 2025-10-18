# {{title}}

Offline jsPsych experiment created with `@jspsych/offline-pwa-cli`.

## Getting Started

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Run development server:

\`\`\`bash
npm run dev
\`\`\`

Build for production:

\`\`\`bash
npm run build
\`\`\`

## Project Structure

- `src/experiment.ts` - Main experiment file
- `src/admin.ts` - Data manager interface
- `public/` - Static assets and HTML files

## Data Management

Access the data manager at `/admin.html` to:

- View collected sessions
- Export data (CSV, JSON, ZIP)
- Delete old sessions
- Monitor storage usage

## Deployment

### GitHub Pages (Recommended - Automatic)

This project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push.

**Setup (one-time)**:

1. Create a GitHub repository and push your code:

   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create {{name}} --public --source=. --push
   \`\`\`

   Or push to an existing repo:

   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/{{name}}.git
   git branch -M main
   git push -u origin main
   \`\`\`

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: **GitHub Actions**

3. Done! Your experiment is now live at:
   \`https://YOUR_USERNAME.github.io/{{name}}/\`

**Future updates**: Just push to main and it automatically rebuilds and redeploys!

\`\`\`bash
git add .
git commit -m "Update experiment"
git push
\`\`\`

### Option 2: Netlify

1. Connect your repository to Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Deploy!

### Option 3: Any Static Host

1. Build the project: \`npm run build\`
2. Upload the \`dist/\` folder to any static hosting service that supports HTTPS:
   - Vercel
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Your university web server

## Installing on Tablets

1. Visit your deployed URL on the tablet (requires internet connection first time)
2. In browser menu, select "Add to Home Screen" (iOS Safari) or "Install app" (Android Chrome)
3. The PWA will cache all files for offline use
4. After installation, works completely offline

## Offline Capabilities

This experiment uses IndexedDB for local data storage and is installable as a Progressive Web App (PWA). Data is stored locally on the device and can be exported when ready.

## Learn More

- [jsPsych Documentation](https://www.jspsych.org/)
- [Offline Storage Documentation](https://github.com/jspsych/offline-pwa)
