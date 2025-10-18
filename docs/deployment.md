# Deployment Guide

Learn how to deploy your offline jsPsych experiment to tablets and make it installable as a Progressive Web App.

## Building for Production

**CDN Template**: No build step needed! Files are ready to deploy as-is.

**Build Template**: Build your experiment:

```bash
npm run build
```

This creates a `dist/` directory with optimized files ready for deployment.

## Deployment Options

### Option 1: GitHub Pages (Recommended - Automatic)

Both templates include GitHub Actions workflows that automatically deploy when you push to GitHub.

#### Setup (One-time)

1. Create a GitHub repository and push your code:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create my-experiment --public --source=. --push
   ```

   Or push to an existing repo:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/my-experiment.git
   git branch -M main
   git push -u origin main
   ```

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: **GitHub Actions**

3. Done! Your experiment is now live at:
   `https://YOUR_USERNAME.github.io/my-experiment/`

#### How It Works

**CDN Template**: Deploys all files directly (no build step)

**Build Template**: Runs `npm ci && npm run build`, then deploys the `dist/` folder

The included workflow file (`.github/workflows/deploy.yml`) handles everything automatically.

#### Future Updates

Just push to main and it automatically redeploys:

```bash
git add .
git commit -m "Update experiment"
git push
```

#### Manual Deployment (Alternative)

If you prefer manual control:

**CDN Template**:

```bash
npx gh-pages -d .
```

**Build Template**:

```bash
npm run build
npx gh-pages -d dist
```

Your experiment will be available at `https://[username].github.io/[repo-name]/`

### Option 2: Netlify

Netlify offers automatic deployments from Git with great developer experience.

#### Setup

1. Sign up at [netlify.com](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

Your site will be available at `https://[site-name].netlify.app`

#### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### Option 3: Vercel

Similar to Netlify with excellent performance.

1. Sign up at [vercel.com](https://vercel.com/)
2. Import your Git repository
3. Vercel auto-detects Vite and configures automatically
4. Deploy!

### Option 4: Self-Hosted

Host on your own server or university infrastructure.

1. Build the project: `npm run build`
2. Copy `dist/` contents to your web server
3. Configure your web server to serve the files

**Example Nginx configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Installing on Tablets

Once deployed, participants can install your experiment as a Progressive Web App.

### iOS (iPhone/iPad)

1. Open Safari and navigate to your experiment URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name the app and tap **"Add"**
5. The experiment icon appears on the home screen

**Important for iOS:**

- Must use Safari (other browsers don't support PWA installation)
- Service workers have some limitations on iOS
- Data persists across sessions unless the app is uninstalled

### Android

1. Open Chrome and navigate to your experiment URL
2. Tap the menu (⋮) button
3. Tap **"Add to Home screen"** or **"Install app"**
4. Confirm the installation
5. The experiment icon appears on the home screen

**Chrome will automatically show an install prompt if:**

- The app has a valid manifest
- Uses HTTPS (or localhost for testing)
- Has a service worker
- User has interacted with the page

### Testing Locally

Test PWA features on your development machine:

```bash
npm run build
npm run preview
```

Then open the preview URL in your browser.

## HTTPS Requirement

PWAs require HTTPS in production. Fortunately, all recommended hosting options provide HTTPS automatically:

- GitHub Pages: ✅ Automatic HTTPS
- Netlify: ✅ Automatic HTTPS
- Vercel: ✅ Automatic HTTPS

For self-hosted setups, use [Let's Encrypt](https://letsencrypt.org/) for free SSL certificates.

## PWA Configuration

### manifest.json

The app manifest controls how your PWA appears when installed. Edit `public/manifest.json`:

```json
{
  "name": "My Experiment",
  "short_name": "Experiment",
  "description": "Description of your experiment",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Icons

Place icons in `public/`:

- `icon-192.png` - 192×192px
- `icon-512.png` - 512×512px

Use the jsPsych logo or create custom icons for your experiment.

### Service Worker

The generated service worker (`public/sw.js`) handles offline functionality. It caches:

- HTML files
- JavaScript bundles
- CSS files
- Static assets

## Managing Tablet Deployments

### Kiosk Mode

For research settings, you may want to lock tablets into kiosk mode:

**iOS Guided Access:**

1. Settings → Accessibility → Guided Access
2. Enable Guided Access
3. Set a passcode
4. Open your experiment
5. Triple-click home button to start Guided Access

**Android Kiosk Mode:**

Use a kiosk app like [Fully Kiosk Browser](https://www.fully-kiosk.com/) or [Kiosk Browser Lockdown](https://play.google.com/store/apps/details?id=com.procoit.kioskbrowser).

### Multiple Tablets

To deploy to multiple tablets:

1. Install on one tablet using the steps above
2. For additional tablets, simply visit the same URL
3. Each tablet will have its own independent data storage

### Updating Experiments

To update the experiment on deployed tablets:

1. Deploy the new version to your hosting
2. Tablets will automatically update on next launch (service worker checks for updates)
3. Existing data remains intact

To force immediate update on tablets:

1. Uninstall the PWA
2. Reinstall from the URL

## Data Collection Workflow

Recommended workflow for collecting data from tablets:

1. **Deploy** experiment to web hosting
2. **Install** on tablets as PWA
3. **Collect** data offline (no internet needed)
4. **Export** data via the admin interface (`/admin.html`)
5. **Transfer** files via:
   - Email
   - Cloud storage (Dropbox, Google Drive)
   - USB cable (download to computer)
   - AirDrop (iOS)

## Troubleshooting

### PWA Not Installing

- Verify HTTPS is enabled (required for PWA)
- Check manifest.json is valid
- Ensure service worker is registered
- Try in different browser (Safari for iOS, Chrome for Android)

### Data Not Persisting

- Check browser storage settings
- Verify IndexedDB is enabled
- Ensure private browsing mode is OFF
- Check storage quota hasn't been exceeded

### Updates Not Applying

- Clear browser cache
- Uninstall and reinstall PWA
- Check service worker is updating (DevTools → Application → Service Workers)

### Storage Full

- Export and delete old sessions via `/admin.html`
- Check storage warnings in the admin interface
- Consider increasing `typicalSessionSize` option to get earlier warnings

## Best Practices

1. **Test thoroughly** on actual tablets before deployment
2. **Monitor storage** regularly via the admin interface
3. **Export data frequently** to avoid data loss
4. **Keep backups** of exported data
5. **Test offline mode** by enabling airplane mode
6. **Use HTTPS** always in production
7. **Version your experiments** using session metadata
8. **Document** deployment process for your team

## Security Considerations

### Data Privacy

- Data stored locally on device (not transmitted unless explicitly exported)
- Use device encryption (enabled by default on modern tablets)
- Clear data when device is returned/reused

### Access Control

- Consider password-protecting the admin interface
- Use kiosk mode to prevent participants accessing admin
- Implement session timeouts for sensitive experiments

### Compliance

- Ensure compliance with IRB requirements
- Document data storage practices
- Provide clear consent about local data storage
