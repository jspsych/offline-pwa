import { IDBPDatabase } from "idb";
import JSZip from "jszip";
import Papa from "papaparse";
import { getAllSessions, getSessionTrials, SessionData, TrialData } from "./storage.js";

export type ExportFormat = "csv" | "json" | "zip";

/**
 * Export all sessions as CSV files (one per session)
 */
export async function exportAllCSV(db: IDBPDatabase): Promise<Blob> {
  const sessions = await getAllSessions(db);

  if (sessions.length === 0) {
    throw new Error("No data to export");
  }

  if (sessions.length === 1) {
    // Single session - return CSV file
    const trials = await getSessionTrials(db, sessions[0].id);
    const csv = generateCSV(trials);
    return new Blob([csv], { type: "text/csv" });
  } else {
    // Multiple sessions - return ZIP file
    return await exportAllZIP(db, "csv");
  }
}

/**
 * Export all sessions as JSON files (one per session)
 */
export async function exportAllJSON(db: IDBPDatabase): Promise<Blob> {
  const sessions = await getAllSessions(db);

  if (sessions.length === 0) {
    throw new Error("No data to export");
  }

  if (sessions.length === 1) {
    // Single session - return JSON file
    const sessionData = await getSessionData(db, sessions[0]);
    const json = JSON.stringify(sessionData, null, 2);
    return new Blob([json], { type: "application/json" });
  } else {
    // Multiple sessions - return ZIP file
    return await exportAllZIP(db, "json");
  }
}

/**
 * Export all sessions as a ZIP file
 */
export async function exportAllZIP(db: IDBPDatabase, format: "csv" | "json"): Promise<Blob> {
  const sessions = await getAllSessions(db);

  if (sessions.length === 0) {
    throw new Error("No data to export");
  }

  const zip = new JSZip();

  for (const session of sessions) {
    const trials = await getSessionTrials(db, session.id);

    if (format === "csv") {
      const csv = generateCSV(trials);
      const filename = `session_${session.id}_${session.startTime}.csv`;
      zip.file(filename, csv);
    } else {
      const sessionData = await getSessionData(db, session);
      const json = JSON.stringify(sessionData, null, 2);
      const filename = `session_${session.id}_${session.startTime}.json`;
      zip.file(filename, json);
    }
  }

  return await zip.generateAsync({ type: "blob" });
}

/**
 * Export data in specified format
 */
export async function exportAll(db: IDBPDatabase, format: ExportFormat): Promise<Blob> {
  switch (format) {
    case "csv":
      return await exportAllCSV(db);
    case "json":
      return await exportAllJSON(db);
    case "zip":
      return await exportAllZIP(db, "csv");
    default:
      throw new Error(`Unknown export format: ${format}`);
  }
}

/**
 * Generate CSV from trial data
 */
function generateCSV(trials: TrialData[]): string {
  if (trials.length === 0) {
    return "";
  }

  // Flatten trial data
  const flatData = trials.map((trial) => ({
    sessionId: trial.sessionId,
    trialIndex: trial.trialIndex,
    timestamp: trial.timestamp,
    ...trial.data,
  }));

  return Papa.unparse(flatData);
}

/**
 * Get complete session data including trials
 */
async function getSessionData(db: IDBPDatabase, session: SessionData) {
  const trials = await getSessionTrials(db, session.id);

  return {
    session: {
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      completed: session.completed,
      trialCount: session.trialCount,
      metadata: session.metadata,
    },
    trials: trials.map((trial) => ({
      trialIndex: trial.trialIndex,
      timestamp: trial.timestamp,
      data: trial.data,
    })),
  };
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get appropriate filename for export
 */
export function getExportFilename(format: ExportFormat, sessionCount: number): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);

  if (sessionCount === 1) {
    return `jspsych-data_${timestamp}.${format}`;
  } else {
    return `jspsych-data_${sessionCount}-sessions_${timestamp}.zip`;
  }
}
