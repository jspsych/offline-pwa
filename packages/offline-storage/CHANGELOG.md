# @jspsych/offline-storage

## 0.4.0

### Minor Changes

- [#8](https://github.com/jspsych/offline-pwa/pull/8) [`2806621bf4bbdc5ddf43456fcdaafd4297114458`](https://github.com/jspsych/offline-pwa/commit/2806621bf4bbdc5ddf43456fcdaafd4297114458) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Add getOfflineDataManager() function to access offline API without creating a new session. Admin templates now use this function instead of initJsPsychOffline() to avoid creating spurious sessions.

## 0.3.0

### Minor Changes

- [#4](https://github.com/jspsych/offline-pwa/pull/4) [`024afb5e52759f09cff334905dc631d04c9e7fcb`](https://github.com/jspsych/offline-pwa/commit/024afb5e52759f09cff334905dc631d04c9e7fcb) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Make initJsPsychOffline synchronous and remove UI helpers. initJsPsychOffline now returns immediately like initJsPsych, with database initialization happening in the background. Removed autoShowCompletionScreen option and UI helper functions - researchers should handle completion using standard jsPsych methods.

## 0.2.0

### Minor Changes

- [#2](https://github.com/jspsych/offline-pwa/pull/2) [`c45416904f74e207dce1baf70391ae7c41ae405f`](https://github.com/jspsych/offline-pwa/commit/c45416904f74e207dce1baf70391ae7c41ae405f) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Initial release of jsPsych Offline PWA tools
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

### Patch Changes

- [#2](https://github.com/jspsych/offline-pwa/pull/2) [`c45416904f74e207dce1baf70391ae7c41ae405f`](https://github.com/jspsych/offline-pwa/commit/c45416904f74e207dce1baf70391ae7c41ae405f) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Add browser build for offline-storage package and update CDN template to use browser builds instead of ES modules
