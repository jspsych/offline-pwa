# API Reference

Complete API documentation for `@jspsych/offline-storage`.

## initJsPsychOffline()

Initialize jsPsych with offline storage capabilities.

```typescript
const jsPsych = await initJsPsychOffline(options);
```

### Parameters

#### `options` (optional)

An object containing jsPsych options and offline-specific configuration.

```typescript
interface JsPsychOfflineOptions {
  offline?: OfflineOptions;
  on_data_update?: (data: any) => void | Promise<void>;
  on_finish?: (data: any) => void | Promise<void>;
  // ... any other jsPsych options
}
```

#### `options.offline` (optional)

Offline-specific configuration:

```typescript
interface OfflineOptions {
  // Custom database name (default: "jspsych-offline")
  dbName?: string;

  // Session metadata to store with this session
  sessionMetadata?: any;

  // Whether to automatically show completion screen (default: true)
  autoShowCompletionScreen?: boolean;

  // Estimated size of typical session in bytes for storage warning (default: 1MB)
  typicalSessionSize?: number;
}
```

**Example:**

```typescript
const jsPsych = await initJsPsychOffline({
  offline: {
    dbName: "my-experiment",
    sessionMetadata: {
      experimentVersion: "1.0.0",
      condition: "control",
    },
    autoShowCompletionScreen: true,
    typicalSessionSize: 2 * 1024 * 1024, // 2MB
  },
  timeline: myTimeline,
});
```

### Returns

A `JsPsychOffline` object that extends the standard jsPsych instance with an `offline` property.

## jsPsych.offline

The `offline` property provides methods for managing offline data.

### Properties

#### `sessionId: string`

The unique ID for the current session.

```typescript
console.log(jsPsych.offline.sessionId);
// "550e8400-e29b-41d4-a716-446655440000"
```

### Methods

#### `getSessionCount(): Promise<number>`

Get the total number of sessions stored locally.

```typescript
const count = await jsPsych.offline.getSessionCount();
console.log(`Total sessions: ${count}`);
```

#### `getCompletedSessionCount(): Promise<number>`

Get the number of completed sessions.

```typescript
const completed = await jsPsych.offline.getCompletedSessionCount();
console.log(`Completed sessions: ${completed}`);
```

#### `getAllSessions(): Promise<SessionData[]>`

Get all session records.

```typescript
const sessions = await jsPsych.offline.getAllSessions();

sessions.forEach((session) => {
  console.log(session.id, session.startTime, session.trialCount);
});
```

**Session Data Structure:**

```typescript
interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
  trialCount: number;
  metadata?: any;
}
```

#### `deleteSession(sessionId: string): Promise<void>`

Delete a specific session and all its trial data.

```typescript
await jsPsych.offline.deleteSession("550e8400-e29b-41d4-a716-446655440000");
```

#### `clearAllData(): Promise<void>`

Delete all sessions and trial data.

```typescript
if (confirm("Delete all data?")) {
  await jsPsych.offline.clearAllData();
}
```

#### `exportAll(format: ExportFormat): Promise<void>`

Export all data and trigger browser download.

```typescript
// Export as CSV (one file per session, zipped if multiple)
await jsPsych.offline.exportAll("csv");

// Export as JSON
await jsPsych.offline.exportAll("json");

// Export as ZIP
await jsPsych.offline.exportAll("zip");
```

**Export Formats:**

- `"csv"` - CSV format (one file per session)
- `"json"` - JSON format with full session metadata
- `"zip"` - ZIP file containing CSV files for all sessions

#### `getStorageEstimate(): Promise<StorageEstimate>`

Get current storage usage and quota.

```typescript
const storage = await jsPsych.offline.getStorageEstimate();

console.log(`Used: ${storage.usage} bytes`);
console.log(`Quota: ${storage.quota} bytes`);
console.log(`Percent used: ${storage.percentUsed}%`);
```

**Returns:**

```typescript
interface StorageEstimate {
  usage: number; // Bytes used
  quota: number; // Total quota
  percentUsed: number; // Percentage (0-100)
}
```

#### `checkStorageWarning(): Promise<boolean>`

Check if storage is running low (less than 5x the size of a typical session).

```typescript
const isLow = await jsPsych.offline.checkStorageWarning();

if (isLow) {
  alert("Storage is running low! Please export and delete old sessions.");
}
```

#### `showCompletionScreen(): Promise<void>`

Manually display the completion screen.

```typescript
await jsPsych.offline.showCompletionScreen();
```

#### `showDataManager(): void`

Navigate to the data manager interface.

```typescript
jsPsych.offline.showDataManager();
// Redirects to /admin.html
```

## Data Structure

### Trial Data

Each trial is stored with the following structure:

```typescript
interface TrialData {
  sessionId: string; // Session UUID
  trialIndex: number; // 0-indexed trial number
  timestamp: number; // Unix timestamp (ms)
  data: any; // Trial data from jsPsych
}
```

### Session Data

Sessions are stored with this structure:

```typescript
interface SessionData {
  id: string; // Session UUID
  startTime: number; // Unix timestamp (ms)
  endTime?: number; // Unix timestamp (ms)
  completed: boolean; // Whether experiment finished
  trialCount: number; // Number of trials completed
  metadata?: any; // Custom metadata
}
```

## Storage Backend

Data is stored in IndexedDB with two object stores:

- `sessions` - Session records
- `trials` - Trial data

Database name: `jspsych-offline` (customizable via options)

## TypeScript Types

All types are exported from the package:

```typescript
import type {
  JsPsychOffline,
  JsPsychOfflineOptions,
  OfflineOptions,
  OfflineAPI,
  SessionData,
  TrialData,
  ExportFormat,
} from "@jspsych/offline-storage";
```

## Error Handling

All async methods can throw errors. Use try-catch for error handling:

```typescript
try {
  await jsPsych.offline.exportAll("csv");
  alert("Data exported successfully!");
} catch (error) {
  console.error("Export failed:", error);
  alert("Failed to export data. Please try again.");
}
```

## Browser Compatibility

Requires browsers that support:

- IndexedDB
- ES2020 (async/await, dynamic imports)
- Service Workers (for PWA features)

Tested on:

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
