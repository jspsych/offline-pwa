import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "jspsych-offline";
const DB_VERSION = 1;
const SESSIONS_STORE = "sessions";
const TRIALS_STORE = "trials";

export interface TrialData {
  sessionId: string;
  trialIndex: number;
  timestamp: number;
  data: any;
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
  trialCount: number;
  metadata?: any;
}

let dbInstance: IDBPDatabase | null = null;

/**
 * Initialize the IndexedDB database
 */
export async function init(dbName: string = DB_NAME): Promise<IDBPDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB(dbName, DB_VERSION, {
    upgrade(db) {
      // Create sessions store
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        const sessionStore = db.createObjectStore(SESSIONS_STORE, { keyPath: "id" });
        sessionStore.createIndex("startTime", "startTime");
        sessionStore.createIndex("completed", "completed");
      }

      // Create trials store
      if (!db.objectStoreNames.contains(TRIALS_STORE)) {
        const trialStore = db.createObjectStore(TRIALS_STORE, { autoIncrement: true });
        trialStore.createIndex("sessionId", "sessionId");
        trialStore.createIndex("timestamp", "timestamp");
      }
    },
  });

  return dbInstance;
}

/**
 * Create a new session
 */
export async function createSession(
  db: IDBPDatabase,
  sessionId: string,
  metadata?: any,
): Promise<void> {
  const session: SessionData = {
    id: sessionId,
    startTime: Date.now(),
    completed: false,
    trialCount: 0,
    metadata,
  };

  await db.add(SESSIONS_STORE, session);
}

/**
 * Save trial data
 */
export async function saveTrial(
  db: IDBPDatabase,
  sessionId: string,
  trialIndex: number,
  data: any,
): Promise<void> {
  const trial: TrialData = {
    sessionId,
    trialIndex,
    timestamp: Date.now(),
    data,
  };

  await db.add(TRIALS_STORE, trial);

  // Update session trial count
  const session = await db.get(SESSIONS_STORE, sessionId);
  if (session) {
    session.trialCount = trialIndex + 1;
    await db.put(SESSIONS_STORE, session);
  }
}

/**
 * Finalize a session (mark as completed)
 */
export async function finalizeSession(db: IDBPDatabase, sessionId: string): Promise<void> {
  const session = await db.get(SESSIONS_STORE, sessionId);
  if (session) {
    session.completed = true;
    session.endTime = Date.now();
    await db.put(SESSIONS_STORE, session);
  }
}

/**
 * Get count of all sessions
 */
export async function getSessionCount(db: IDBPDatabase): Promise<number> {
  return await db.count(SESSIONS_STORE);
}

/**
 * Get count of completed sessions
 */
export async function getCompletedSessionCount(db: IDBPDatabase): Promise<number> {
  const index = db.transaction(SESSIONS_STORE).store.index("completed");
  return await index.count(IDBKeyRange.only(true));
}

/**
 * Get all sessions
 */
export async function getAllSessions(db: IDBPDatabase): Promise<SessionData[]> {
  return await db.getAll(SESSIONS_STORE);
}

/**
 * Get all trials for a session
 */
export async function getSessionTrials(db: IDBPDatabase, sessionId: string): Promise<TrialData[]> {
  const index = db.transaction(TRIALS_STORE).store.index("sessionId");
  return await index.getAll(IDBKeyRange.only(sessionId));
}

/**
 * Delete a session and all its trials
 */
export async function deleteSession(db: IDBPDatabase, sessionId: string): Promise<void> {
  // Delete session
  await db.delete(SESSIONS_STORE, sessionId);

  // Delete all trials for this session
  const trials = await getSessionTrials(db, sessionId);
  const tx = db.transaction(TRIALS_STORE, "readwrite");
  const store = tx.store;

  for (const trial of trials) {
    const cursor = await store.openCursor();
    if (cursor) {
      const value = cursor.value as TrialData;
      if (value.sessionId === sessionId) {
        await cursor.delete();
      }
    }
  }

  await tx.done;
}

/**
 * Clear all data
 */
export async function clearAllData(db: IDBPDatabase): Promise<void> {
  await db.clear(SESSIONS_STORE);
  await db.clear(TRIALS_STORE);
}

/**
 * Estimate storage usage and quota
 */
export async function getStorageEstimate(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
}> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentUsed };
  }

  return { usage: 0, quota: 0, percentUsed: 0 };
}

/**
 * Check if storage is running low (less than 5x the size of a typical session)
 */
export async function isStorageLow(typicalSessionSize: number): Promise<boolean> {
  const { usage, quota } = await getStorageEstimate();
  const remaining = quota - usage;
  return remaining < typicalSessionSize * 5;
}
