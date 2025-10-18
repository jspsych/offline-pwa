import { initJsPsychOffline } from "@jspsych/offline-storage";

// Initialize offline API without running experiment
const { offline } = await initJsPsychOffline({ timeline: [] });

async function init() {
  await updateStats();
  await updateSessionList();
  await checkStorage();
}

async function updateStats() {
  const sessionCount = await offline.getSessionCount();
  const completedCount = await offline.getCompletedSessionCount();
  const storage = await offline.getStorageEstimate();

  document.getElementById("session-count")!.textContent = sessionCount.toString();
  document.getElementById("completed-count")!.textContent = completedCount.toString();
  document.getElementById("storage-used")!.textContent =
    formatBytes(storage.usage) + " / " + formatBytes(storage.quota);
}

async function updateSessionList() {
  const sessions = await offline.getAllSessions();
  const listElement = document.getElementById("session-list")!;

  if (sessions.length === 0) {
    listElement.innerHTML = '<p style="color: #7f8c8d;">No sessions recorded yet.</p>';
    return;
  }

  listElement.innerHTML = sessions
    .map(
      (session) => `
    <div class="session-item">
      <div class="session-info">
        <strong>Session ${session.id.slice(0, 8)}...</strong><br>
        <small>
          Started: ${new Date(session.startTime).toLocaleString()}<br>
          Trials: ${session.trialCount} | Status: ${session.completed ? "✓ Complete" : "⚠ Incomplete"}
        </small>
      </div>
      <div class="session-actions">
        <button onclick="deleteSession('${session.id}')">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");
}

async function checkStorage() {
  const warning = await offline.checkStorageWarning();
  const warningElement = document.getElementById("storage-warning")!;

  if (warning) {
    warningElement.innerHTML = `
      <div class="warning">
        <p><strong>⚠️ Storage Warning:</strong> Device storage is running low.
        Please export and delete old sessions to free up space.</p>
      </div>
    `;
  }
}

(window as any).exportData = async function (format: string) {
  try {
    await offline.exportAll(format as any);
    alert("Data exported successfully!");
  } catch (error: any) {
    alert("Error exporting data: " + error.message);
  }
};

(window as any).deleteSession = async function (sessionId: string) {
  if (confirm("Are you sure you want to delete this session?")) {
    await offline.deleteSession(sessionId);
    await updateStats();
    await updateSessionList();
  }
};

(window as any).clearAllData = async function () {
  if (confirm("Are you sure? This will permanently delete ALL data!")) {
    if (confirm("This cannot be undone. Are you absolutely sure?")) {
      await offline.clearAllData();
      await updateStats();
      await updateSessionList();
      alert("All data has been cleared.");
    }
  }
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

init();
