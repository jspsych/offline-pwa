---
"@jspsych/offline-storage": minor
"@jspsych/new-pwa": minor
---

Initial release of jsPsych Offline PWA tools

- **@jspsych/offline-storage**: Runtime library for offline data persistence with IndexedDB
  - `initJsPsychOffline()` wrapper for automatic data storage
  - Export data in CSV, JSON, or ZIP formats
  - Built-in data manager interface
  - Storage warnings when device storage is low
  - Session and trial data management

- **@jspsych/new-pwa**: CLI tool for scaffolding offline experiments
  - Interactive project creation with template selection
  - **CDN template**: No build step, plain JavaScript, CDN imports
  - **Build template**: TypeScript, Vite, npm packages
  - PWA manifest and enhanced service worker (pre-caches CDN dependencies)
  - Example experiment included in both templates
  - Admin interface for data management
  - Template-specific deployment instructions
