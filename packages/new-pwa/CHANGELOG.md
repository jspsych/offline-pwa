# @jspsych/new-pwa

## 0.3.0

### Minor Changes

- [#8](https://github.com/jspsych/offline-pwa/pull/8) [`2806621bf4bbdc5ddf43456fcdaafd4297114458`](https://github.com/jspsych/offline-pwa/commit/2806621bf4bbdc5ddf43456fcdaafd4297114458) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Add getOfflineDataManager() function to access offline API without creating a new session. Admin templates now use this function instead of initJsPsychOffline() to avoid creating spurious sessions.

- [#8](https://github.com/jspsych/offline-pwa/pull/8) [`2806621bf4bbdc5ddf43456fcdaafd4297114458`](https://github.com/jspsych/offline-pwa/commit/2806621bf4bbdc5ddf43456fcdaafd4297114458) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Templates now dynamically use the current offline-storage package version instead of hardcoded version numbers, ensuring newly created projects always reference the latest published version.

## 0.2.1

### Patch Changes

- [#6](https://github.com/jspsych/offline-pwa/pull/6) [`b70363c319c0affa411197429d44a8cf0059fa2a`](https://github.com/jspsych/offline-pwa/commit/b70363c319c0affa411197429d44a8cf0059fa2a) Thanks [@jodeleeuw](https://github.com/jodeleeuw)! - Fix template experiment code to use evaluateTimelineVariable() instead of timelineVariable() inside functions, and add jsPsych CSS stylesheet to both templates

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
