import { IDBPDatabase } from "idb";
import { JsPsych, initJsPsych } from "jspsych";
import {
  init,
  createSession,
  saveTrial,
  finalizeSession,
  getSessionCount,
  getCompletedSessionCount,
  getAllSessions,
  deleteSession,
  clearAllData,
  getStorageEstimate,
  isStorageLow,
  SessionData,
} from "./storage.js";
import { exportAll, downloadBlob, getExportFilename, ExportFormat } from "./exporter.js";

export interface OfflineOptions {
  /**
   * Custom database name (default: "jspsych-offline")
   */
  dbName?: string;

  /**
   * Session metadata to store
   */
  sessionMetadata?: any;

  /**
   * Estimated size of typical session in bytes for storage warning (default: 1MB)
   */
  typicalSessionSize?: number;
}

export interface JsPsychOfflineOptions {
  /**
   * Offline-specific options
   */
  offline?: OfflineOptions;

  /**
   * Original jsPsych callbacks (will be wrapped)
   */
  on_data_update?: (data: any) => void | Promise<void>;
  on_finish?: (data: any) => void | Promise<void>;

  /**
   * Any other jsPsych options
   */
  [key: string]: any;
}

export interface OfflineAPI {
  sessionId: string;
  getSessionCount: () => Promise<number>;
  getCompletedSessionCount: () => Promise<number>;
  getAllSessions: () => Promise<SessionData[]>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  exportAll: (format: ExportFormat) => Promise<void>;
  getStorageEstimate: () => Promise<{ usage: number; quota: number; percentUsed: number }>;
  checkStorageWarning: () => Promise<boolean>;
}

export interface JsPsychOffline extends JsPsych {
  offline: OfflineAPI;
}

let lastSessionSize = 0;

/**
 * Initialize jsPsych with offline storage capabilities
 */
export function initJsPsychOffline(options: JsPsychOfflineOptions = {}): JsPsychOffline {
  const { offline = {}, ...jsPsychOptions } = options;

  const {
    dbName,
    sessionMetadata,
    typicalSessionSize = 1024 * 1024, // 1MB default
  } = offline;

  // Initialize storage asynchronously in background
  const sessionId = crypto.randomUUID();
  let db: IDBPDatabase | null = null;
  let sessionStartSize = 0;
  let trialIndex = 0;
  let isInitialized = false;

  // Initialize database in background
  const initPromise = (async () => {
    db = await init(dbName);
    await createSession(db, sessionId, sessionMetadata);
    sessionStartSize = (await getStorageEstimate()).usage;
    isInitialized = true;
  })();

  // Wrap jsPsych init
  const jsPsych = initJsPsych({
    ...jsPsychOptions,
    on_data_update: async (data: any) => {
      // Wait for initialization if not ready
      if (!isInitialized) {
        await initPromise;
      }

      await saveTrial(db!, sessionId, trialIndex, data);
      trialIndex++;

      if (jsPsychOptions.on_data_update) {
        await jsPsychOptions.on_data_update(data);
      }
    },
    on_finish: async (data: any) => {
      // Wait for initialization if not ready
      if (!isInitialized) {
        await initPromise;
      }

      await finalizeSession(db!, sessionId);

      // Calculate session size
      const sessionEndSize = (await getStorageEstimate()).usage;
      lastSessionSize = sessionEndSize - sessionStartSize;

      // Check storage warning
      const storageWarning = await isStorageLow(Math.max(lastSessionSize, typicalSessionSize));

      if (jsPsychOptions.on_finish) {
        await jsPsychOptions.on_finish(data);
      }

      // Warn if storage is low
      if (storageWarning) {
        console.warn(
          "Storage is running low. Consider exporting and deleting old sessions to free up space.",
        );
      }
    },
  }) as JsPsychOffline;

  // Create offline API
  const offlineAPI: OfflineAPI = {
    sessionId,

    getSessionCount: async () => {
      if (!isInitialized) await initPromise;
      return await getSessionCount(db!);
    },

    getCompletedSessionCount: async () => {
      if (!isInitialized) await initPromise;
      return await getCompletedSessionCount(db!);
    },

    getAllSessions: async () => {
      if (!isInitialized) await initPromise;
      return await getAllSessions(db!);
    },

    deleteSession: async (sessionId: string) => {
      if (!isInitialized) await initPromise;
      await deleteSession(db!, sessionId);
    },

    clearAllData: async () => {
      if (!isInitialized) await initPromise;
      await clearAllData(db!);
    },

    exportAll: async (format: ExportFormat) => {
      if (!isInitialized) await initPromise;
      const blob = await exportAll(db!, format);
      const sessionCount = await getSessionCount(db!);
      const filename = getExportFilename(format, sessionCount);
      downloadBlob(blob, filename);
    },

    getStorageEstimate: async () => {
      return await getStorageEstimate();
    },

    checkStorageWarning: async () => {
      const sizeToCheck = lastSessionSize > 0 ? lastSessionSize : typicalSessionSize;
      return await isStorageLow(sizeToCheck);
    },
  };

  // Add offline methods to jsPsych instance
  jsPsych.offline = offlineAPI;

  return jsPsych;
}

// Re-export types and utilities
export type { SessionData, TrialData } from "./storage.js";
export type { ExportFormat } from "./exporter.js";
