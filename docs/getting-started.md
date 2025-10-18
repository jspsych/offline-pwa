# Getting Started

This guide will help you create your first offline jsPsych experiment that can run on tablets without internet connectivity.

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Basic familiarity with jsPsych

## Installation

Create a new offline experiment using the CLI tool. The tool creates files in the current directory, so start with an empty folder (cloning an empty GitHub repo works great).

```bash
git clone https://github.com/YOUR_USERNAME/my-experiment.git
cd my-experiment
npx @jspsych/new-pwa
```

You'll be prompted for:

- **Experiment title**: Human-readable title for your experiment (defaults to folder name)
- **Template choice**:
  - **CDN imports** (recommended) - No build step, plain JavaScript
  - **npm packages** - Build process with TypeScript

### Template Comparison

| Feature              | CDN Template               | Build Template   |
| -------------------- | -------------------------- | ---------------- |
| Build step           | ❌ None                    | ✅ Required      |
| Language             | JavaScript                 | TypeScript       |
| Dependencies         | CDN imports                | npm packages     |
| Ease of modification | Very easy                  | Moderate         |
| Bundle optimization  | None                       | Optimized        |
| First load speed     | Slower (multiple requests) | Faster (bundled) |

**Recommendation**: Use CDN template for simpler workflow and easier adoption by non-developers.

## Project Structure

### CDN Template

```
my-experiment/
├── experiment.js        # Main experiment file
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── admin/              # Data manager (accessible at /admin)
│   ├── index.html      # Data manager page
│   └── admin.js        # Data manager logic
├── service/            # Service worker
│   └── sw.js          # Caches CDN URLs for offline use
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment
└── package.json
```

### Build Template

```
my-experiment/
├── src/
│   ├── experiment.ts    # Main experiment file (TypeScript)
│   └── admin.ts         # Data manager interface (TypeScript)
├── public/
│   ├── index.html       # Main HTML file
│   ├── admin.html       # Data manager HTML
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

## Development

### CDN Template

```bash
npm run dev
```

Open your browser to `http://localhost:5173` to see your experiment. No installation needed!

### Build Template

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to see your experiment.

## Your First Experiment

Both templates include a working example experiment. Here's what a minimal experiment looks like:

### CDN Template Example

```javascript
import { initJsPsychOffline } from "https://unpkg.com/@jspsych/offline-storage@0.1";
import htmlKeyboardResponse from "https://unpkg.com/@jspsych/plugin-html-keyboard-response@2";

// Initialize jsPsych with offline storage
const jsPsych = await initJsPsychOffline();

// Create timeline
const timeline = [
  {
    type: htmlKeyboardResponse,
    stimulus: "Welcome to the experiment! Press any key to continue.",
  },
];

// Run experiment
await jsPsych.run(timeline);
```

### Build Template Example

```typescript
import { initJsPsychOffline } from "@jspsych/offline-storage";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

// Initialize jsPsych with offline storage
const jsPsych = await initJsPsychOffline();

// Create timeline
const timeline = [
  {
    type: htmlKeyboardResponse,
    stimulus: "Welcome to the experiment! Press any key to continue.",
  },
];

// Run experiment
await jsPsych.run(timeline);
```

## Key Features

### Automatic Data Storage

Data is automatically saved to IndexedDB after each trial. No need to manually handle storage!

### Completion Screen

After the experiment finishes, participants see a completion screen with:

- Session count
- Storage warning (if running low)
- Options to start a new session or manage data

### Data Manager

Access `/admin.html` to:

- View statistics (total sessions, storage usage)
- Export data in multiple formats (CSV, JSON, ZIP)
- Delete individual sessions
- Clear all data

## Building for Production

### CDN Template

No build step needed! All files are ready to deploy as-is. Simply push to GitHub and the deployment workflow handles everything.

### Build Template

Build your experiment:

```bash
npm run build
```

This creates a `dist/` directory with optimized files ready for deployment.

## Next Steps

- Read the [API Reference](./api-reference.md) for detailed API documentation
- Check out the [Deployment Guide](./deployment.md) to learn how to deploy to tablets
- Browse the [examples](../examples) directory for more complex experiments

## Common Issues

### TypeScript Errors

Make sure all jsPsych plugins are properly imported:

```typescript
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
```

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

### Data Not Persisting

Make sure you're using `initJsPsychOffline` instead of `initJsPsych`:

```typescript
// ✅ Correct
const jsPsych = await initJsPsychOffline();

// ❌ Wrong - data won't be saved
const jsPsych = initJsPsych();
```
