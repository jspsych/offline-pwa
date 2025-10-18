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
import { showCompletionScreen } from "./ui.js";

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
   * Whether to automatically show completion screen (default: true)
   */
  autoShowCompletionScreen?: boolean;

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
  showCompletionScreen: () => Promise<void>;
  showDataManager: () => void;
}

export interface JsPsychOffline extends JsPsych {
  offline: OfflineAPI;
}

let lastSessionSize = 0;

/**
 * Initialize jsPsych with offline storage capabilities
 */
export async function initJsPsychOffline(
  options: JsPsychOfflineOptions = {},
): Promise<JsPsychOffline> {
  const { offline = {}, ...jsPsychOptions } = options;

  const {
    dbName,
    sessionMetadata,
    autoShowCompletionScreen = true,
    typicalSessionSize = 1024 * 1024, // 1MB default
  } = offline;

  // Initialize storage
  const db = await init(dbName);
  const sessionId = crypto.randomUUID();

  // Create session record
  await createSession(db, sessionId, sessionMetadata);

  let trialIndex = 0;
  const sessionStartSize = (await getStorageEstimate()).usage;

  // Wrap jsPsych init
  const jsPsych = initJsPsych({
    ...jsPsychOptions,
    on_data_update: async (data: any) => {
      await saveTrial(db, sessionId, trialIndex, data);
      trialIndex++;

      if (jsPsychOptions.on_data_update) {
        await jsPsychOptions.on_data_update(data);
      }
    },
    on_finish: async (data: any) => {
      await finalizeSession(db, sessionId);

      // Calculate session size
      const sessionEndSize = (await getStorageEstimate()).usage;
      lastSessionSize = sessionEndSize - sessionStartSize;

      // Check storage warning
      const storageWarning = await isStorageLow(Math.max(lastSessionSize, typicalSessionSize));

      if (jsPsychOptions.on_finish) {
        await jsPsychOptions.on_finish(data);
      }

      // Show completion screen if enabled
      if (autoShowCompletionScreen) {
        await showCompletionScreen(offlineAPI);
      } else if (storageWarning) {
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
      return await getSessionCount(db);
    },

    getCompletedSessionCount: async () => {
      return await getCompletedSessionCount(db);
    },

    getAllSessions: async () => {
      return await getAllSessions(db);
    },

    deleteSession: async (sessionId: string) => {
      await deleteSession(db, sessionId);
    },

    clearAllData: async () => {
      await clearAllData(db);
    },

    exportAll: async (format: ExportFormat) => {
      const blob = await exportAll(db, format);
      const sessionCount = await getSessionCount(db);
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

    showCompletionScreen: async () => {
      await showCompletionScreen(offlineAPI);
    },

    showDataManager: () => {
      window.location.href = "/admin.html";
    },
  };

  // Add offline methods to jsPsych instance
  jsPsych.offline = offlineAPI;

  return jsPsych;
}

// Re-export types and utilities
export type { SessionData, TrialData } from "./storage.js";
export type { ExportFormat } from "./exporter.js";
