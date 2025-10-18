# @jspsych/offline-storage

Offline data storage for jsPsych experiments using IndexedDB.

## Installation

```bash
npm install @jspsych/offline-storage jspsych
```

## Usage

```javascript
import { initJsPsychOffline } from "@jspsych/offline-storage";

const jsPsych = await initJsPsychOffline({
  // Standard jsPsych options
  timeline: myTimeline,

  // Optional offline configuration
  offline: {
    dbName: "my-experiment",
    sessionMetadata: {
      experimentVersion: "1.0.0",
      condition: "control",
    },
    typicalSessionSize: 2 * 1024 * 1024, // 2MB
  },
});

await jsPsych.run(timeline);
```

## Features

- **Automatic data persistence**: Trial data automatically saved to IndexedDB after each trial
- **Session management**: Track multiple experiment sessions with metadata
- **Data export**: Export data in CSV, JSON, or ZIP formats
- **Storage warnings**: Automatic alerts when device storage is low
- **Built-in data manager**: UI for viewing, exporting, and managing collected data

## API

### `initJsPsychOffline(options)`

Initializes jsPsych with offline storage capabilities. Returns a jsPsych instance with an additional `offline` property.

**Parameters:**

- `options.offline.dbName` - Custom database name (default: "jspsych-offline")
- `options.offline.sessionMetadata` - Metadata to store with session
- `options.offline.autoShowCompletionScreen` - Show completion screen after experiment (default: true)
- `options.offline.typicalSessionSize` - Expected session size in bytes for storage warnings (default: 1MB)

**Returns:** `JsPsychOffline` instance with `offline` API

### `jsPsych.offline`

Access offline data management methods:

- `sessionId` - Current session ID
- `getSessionCount()` - Get total number of sessions
- `getCompletedSessionCount()` - Get number of completed sessions
- `getAllSessions()` - Get all session records
- `deleteSession(sessionId)` - Delete a specific session
- `clearAllData()` - Delete all sessions and data
- `exportAll(format)` - Export all data ('csv', 'json', or 'zip')
- `getStorageEstimate()` - Get storage usage information
- `checkStorageWarning()` - Check if storage is running low
- `showCompletionScreen()` - Display completion screen
- `showDataManager()` - Navigate to data manager interface

## Data Structure

Data is stored in IndexedDB with two object stores:

- **sessions**: Session metadata (ID, start/end time, trial count, completion status)
- **trials**: Individual trial data (session ID, trial index, timestamp, data)

## Documentation

- [Full Documentation](https://github.com/jspsych/offline-pwa)
- [API Reference](https://github.com/jspsych/offline-pwa/blob/main/docs/api-reference.md)
- [Deployment Guide](https://github.com/jspsych/offline-pwa/blob/main/docs/deployment.md)

## License

MIT
