# jsPsych Offline PWA

Run jsPsych experiments on tablets without internet. Data is stored locally and can be exported when you're ready.

## Getting Started

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `my-experiment` (or whatever you want)
3. Make it **Public**
4. Don't add README, .gitignore, or license
5. Click **Create repository**

### 2. Clone and Create Your Experiment

```bash
git clone https://github.com/YOUR_USERNAME/my-experiment.git
cd my-experiment
npx @jspsych/new-pwa
```

You'll be prompted for:

- **Experiment title**: A human-readable title (default: folder name)
- **Template**: Choose one:
  - **CDN imports** - Simpler, no build step, easier to modify (recommended)
  - **npm packages** - TypeScript, build step, type checking

### 3. Test Locally

**If you chose CDN template:**

```bash
npm run dev
```

**If you chose Build template:**

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Deploy to GitHub Pages

```bash
git add .
git commit -m "Initial commit"
git push
```

Then enable GitHub Pages:

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. Wait ~1 minute

Your experiment is now live at: `https://YOUR_USERNAME.github.io/my-experiment/`

**To update later:**

```bash
git add .
git commit -m "Update experiment"
git push
```

GitHub automatically rebuilds and deploys.

### 5. Install on Tablets

**Tablets need internet for first install only. After that, everything works offline.**

#### iOS (iPad):

1. Open **Safari** (must be Safari, not Chrome)
2. Navigate to your deployed URL (e.g., `https://username.github.io/my-experiment/`)
3. Tap the **Share** button (square with arrow up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**
6. App icon appears on home screen

#### Android:

1. Open **Chrome**
2. Navigate to your deployed URL
3. Tap the **⋮** menu button
4. Tap **"Add to Home Screen"** or **"Install app"**
5. Tap **"Install"**
6. App icon appears on home screen

**Test offline mode**: Enable airplane mode and open the app. It should work!

### 6. Collect Data

Participants run the experiment. Data is automatically saved to the device's local storage (IndexedDB) after each trial.

### 7. Export Data from Tablets

#### On the tablet:

1. Open the installed app
2. Navigate to `/admin`:
   - Tap the address bar
   - Current URL: `https://username.github.io/my-experiment/`
   - Change to: `https://username.github.io/my-experiment/admin`
   - Press Go

3. You'll see the **Data Manager** with:
   - Number of completed sessions
   - Storage usage
   - List of all sessions

4. Tap **"Export All"** button
5. Choose format:
   - **CSV** - One file per session (downloads as ZIP if multiple sessions)
   - **JSON** - All sessions in one structured file
   - **ZIP** - All sessions as CSVs in a ZIP file

6. File downloads to tablet

#### Transfer files off the tablet:

**iOS:**

- Email the file to yourself
- AirDrop to a Mac
- Upload to iCloud Drive, Dropbox, etc.
- Connect to Mac with cable and use Finder

**Android:**

- Email the file to yourself
- Upload to Google Drive, Dropbox, etc.
- Connect to computer with USB cable

**Alternative**: Email directly from data manager (if you add email functionality to admin.js)

## Configuration

### Deployment Settings

The included GitHub Actions workflow deploys your experiment automatically. Configuration is in `.github/workflows/deploy.yml`.

**For Build template**, the base URL is automatically detected from your GitHub repository name. If deploying to a custom domain, edit `vite.config.js`:

```javascript
export default defineConfig({
  base: "/", // Change from auto-detect to root path for custom domains
  // ...
});
```

**For CDN template**, no configuration needed for GitHub Pages.

### PWA Settings

Edit `public/manifest.json` to customize how your app appears when installed:

```json
{
  "name": "My Experiment",
  "short_name": "Experiment",
  "description": "Description shown during install",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Replace icons in `public/` with your own (use jsPsych logo or custom icons).

### Storage Settings

Configure storage behavior when initializing jsPsych:

```javascript
const jsPsych = await initJsPsychOffline({
  offline: {
    dbName: "my-experiment", // Custom database name
    typicalSessionSize: 2 * 1024 * 1024, // 2MB - affects low storage warnings
    sessionMetadata: {
      // Custom metadata per session
      experimentVersion: "1.0.0",
      condition: "control",
    },
  },
});
```

## Troubleshooting

**PWA won't install:**

- Verify you're using HTTPS (GitHub Pages provides this automatically)
- On iOS, must use Safari browser
- Try refreshing the page once before installing

**Data not saving:**

- Check browser console for errors
- Verify you're using `initJsPsychOffline()` not `initJsPsych()`
- Make sure private browsing is OFF

**Can't access admin page:**

- Installed PWAs may cache old URLs
- Type the full URL manually: `https://yoursite.com/admin.html`
- Or uninstall and reinstall the PWA

**Deployment not working:**

- Check GitHub Actions tab for errors
- Verify GitHub Pages source is set to "GitHub Actions"
- For Build template, ensure `package.json` and `package-lock.json` are committed

## Documentation

- [Getting Started Guide](./docs/getting-started.md) - Detailed walkthrough
- [API Reference](./docs/api-reference.md) - Complete API documentation
- [Deployment Guide](./docs/deployment.md) - Advanced deployment options

## Packages

This monorepo contains two npm packages:

- **[@jspsych/offline-storage](./packages/offline-storage)** - Runtime library for offline data persistence
- **[@jspsych/new-pwa](./packages/new-pwa)** - CLI tool for creating new experiments

## Development

Contributing to this project:

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Create a changeset
npm run changeset
```

## License

MIT © jsPsych contributors
