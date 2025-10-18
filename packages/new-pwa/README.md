# @jspsych/new-pwa

CLI tool for creating offline-capable jsPsych experiments that work on tablets without internet connectivity.

## Usage

Create a new experiment:

```bash
npx @jspsych/new-pwa
```

The tool will prompt you for:

- **Experiment title**: Human-readable name
- **Template**: CDN (no build) or Build (TypeScript)

## Templates

### CDN Template

- ✅ No build step required
- ✅ Plain JavaScript
- ✅ CDN imports for all dependencies
- ✅ Works offline after first visit
- ✅ Easy to modify and deploy

Perfect for researchers who want simplicity.

### Build Template

- ✅ TypeScript support
- ✅ Vite build system
- ✅ npm package management
- ✅ Optimized production bundles
- ✅ Type checking

Perfect for developers who want full control.

## Workflow

1. **Create GitHub repo** and clone it
2. **Run CLI** in the repo directory: `npx @jspsych/new-pwa`
3. **Test locally**: `npm run dev`
4. **Deploy**: Push to GitHub and enable GitHub Pages
5. **Install on tablets**: Visit URL and "Add to Home Screen"

Both templates include:

- GitHub Actions workflow for automatic deployment
- PWA manifest for installability
- Service worker for offline functionality
- Admin interface for data management (`/admin`)
- jsPsych logo icons

## Project Structure

**CDN Template:**

```
my-experiment/
├── experiment.js        # Main experiment
├── index.html
├── manifest.json
├── admin/              # Data manager (/admin)
├── service/            # Service worker
└── .github/workflows/  # Auto-deploy
```

**Build Template:**

```
my-experiment/
├── src/
│   ├── experiment.ts
│   └── admin.ts
├── public/
│   ├── index.html
│   ├── admin.html
│   └── manifest.json
├── vite.config.js
└── .github/workflows/
```

## Features

- 📱 Progressive Web App - Installable on tablets
- 💾 Offline storage - Data persists locally
- 📊 Data manager - Export CSV, JSON, or ZIP
- 🚀 Auto-deploy - GitHub Actions included
- 🎨 jsPsych branding - Logo icons included

## Requirements

- Node.js 18+
- Git (for deployment workflow)
- GitHub account (for hosting)

## Documentation

- [Getting Started Guide](https://github.com/jspsych/offline-pwa/blob/main/docs/getting-started.md)
- [Deployment Guide](https://github.com/jspsych/offline-pwa/blob/main/docs/deployment.md)
- [Full Documentation](https://github.com/jspsych/offline-pwa)

## License

MIT
