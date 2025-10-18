import { OfflineAPI } from "./index.js";

/**
 * Show completion screen after experiment
 */
export async function showCompletionScreen(offlineAPI: OfflineAPI): Promise<void> {
  const sessionCount = await offlineAPI.getSessionCount();
  const storageWarning = await offlineAPI.checkStorageWarning();

  // Clear the display
  const displayElement = document.getElementById("jspsych-content");
  if (displayElement) {
    displayElement.innerHTML = `
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: sans-serif;">
        <h1 style="color: #2c3e50;">Experiment Complete!</h1>

        <p style="font-size: 18px; margin: 20px 0;">
          Thank you for participating. Your data has been saved locally on this device.
        </p>

        <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Sessions completed:</strong> ${sessionCount}</p>
        </div>

        ${
          storageWarning
            ? `
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Storage Warning:</strong> Device storage is running low.
              Please export and delete old sessions soon to free up space for future participants.
            </p>
          </div>
        `
            : ""
        }

        <div style="margin-top: 30px;">
          <button onclick="window.location.reload()"
                  style="background: #3498db; color: white; border: none;
                         padding: 12px 24px; font-size: 16px; border-radius: 5px;
                         cursor: pointer; margin-right: 10px;">
            Start New Session
          </button>

          <button onclick="window.location.href='/admin.html'"
                  style="background: #95a5a6; color: white; border: none;
                         padding: 12px 24px; font-size: 16px; border-radius: 5px;
                         cursor: pointer;">
            Manage Data
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Show session counter on experiment page
 */
export async function showSessionCounter(sessionCount: number): Promise<void> {
  const counterElement = document.getElementById("jspsych-session-counter");
  if (counterElement) {
    counterElement.innerHTML = `Sessions: ${sessionCount}`;
  }
}

/**
 * Create a simple data manager UI
 */
export function createDataManagerUI(offlineAPI: OfflineAPI): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Manager</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }

        h1 {
          color: #2c3e50;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-box {
          background: #ecf0f1;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #3498db;
        }

        .stat-label {
          color: #7f8c8d;
          margin-top: 5px;
        }

        button {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        button:hover {
          background: #2980b9;
        }

        button.danger {
          background: #e74c3c;
        }

        button.danger:hover {
          background: #c0392b;
        }

        button.secondary {
          background: #95a5a6;
        }

        button.secondary:hover {
          background: #7f8c8d;
        }

        .session-list {
          margin-top: 20px;
        }

        .session-item {
          background: #f8f9fa;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .session-info {
          flex: 1;
        }

        .session-actions button {
          padding: 8px 16px;
          font-size: 14px;
        }

        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
        }

        .warning p {
          margin: 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <h1>📊 Data Manager</h1>

      <div id="storage-warning"></div>

      <div class="card">
        <h2>Statistics</h2>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-value" id="session-count">0</div>
            <div class="stat-label">Total Sessions</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" id="completed-count">0</div>
            <div class="stat-label">Completed Sessions</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" id="storage-used">0</div>
            <div class="stat-label">Storage Used</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Export Data</h2>
        <p>Download all collected data for analysis:</p>
        <button onclick="exportData('csv')">Export as CSV</button>
        <button onclick="exportData('json')">Export as JSON</button>
        <button onclick="exportData('zip')">Export as ZIP</button>
      </div>

      <div class="card">
        <h2>Sessions</h2>
        <div id="session-list" class="session-list"></div>
      </div>

      <div class="card">
        <h2>Danger Zone</h2>
        <p>Permanently delete all data:</p>
        <button class="danger" onclick="clearAllData()">Clear All Data</button>
      </div>

      <div style="margin-top: 20px;">
        <button class="secondary" onclick="window.location.href='/'">
          ← Back to Experiment
        </button>
      </div>

      <script type="module">
        import { initJsPsychOffline } from '@jspsych/offline-storage';

        let offlineAPI;

        async function init() {
          // Initialize without running experiment
          const { offline } = await initJsPsychOffline({ timeline: [] });
          offlineAPI = offline;

          await updateStats();
          await updateSessionList();
          await checkStorage();
        }

        async function updateStats() {
          const sessionCount = await offlineAPI.getSessionCount();
          const completedCount = await offlineAPI.getCompletedSessionCount();
          const storage = await offlineAPI.getStorageEstimate();

          document.getElementById('session-count').textContent = sessionCount;
          document.getElementById('completed-count').textContent = completedCount;
          document.getElementById('storage-used').textContent =
            formatBytes(storage.usage) + ' / ' + formatBytes(storage.quota);
        }

        async function updateSessionList() {
          const sessions = await offlineAPI.getAllSessions();
          const listElement = document.getElementById('session-list');

          if (sessions.length === 0) {
            listElement.innerHTML = '<p style="color: #7f8c8d;">No sessions recorded yet.</p>';
            return;
          }

          listElement.innerHTML = sessions.map(session => \`
            <div class="session-item">
              <div class="session-info">
                <strong>Session \${session.id.slice(0, 8)}...</strong><br>
                <small>
                  Started: \${new Date(session.startTime).toLocaleString()}<br>
                  Trials: \${session.trialCount} | Status: \${session.completed ? '✓ Complete' : '⚠ Incomplete'}
                </small>
              </div>
              <div class="session-actions">
                <button onclick="deleteSession('\${session.id}')">Delete</button>
              </div>
            </div>
          \`).join('');
        }

        async function checkStorage() {
          const warning = await offlineAPI.checkStorageWarning();
          const warningElement = document.getElementById('storage-warning');

          if (warning) {
            warningElement.innerHTML = \`
              <div class="warning">
                <p><strong>⚠️ Storage Warning:</strong> Device storage is running low.
                Please export and delete old sessions to free up space.</p>
              </div>
            \`;
          }
        }

        window.exportData = async function(format) {
          try {
            await offlineAPI.exportAll(format);
            alert('Data exported successfully!');
          } catch (error) {
            alert('Error exporting data: ' + error.message);
          }
        };

        window.deleteSession = async function(sessionId) {
          if (confirm('Are you sure you want to delete this session?')) {
            await offlineAPI.deleteSession(sessionId);
            await updateStats();
            await updateSessionList();
          }
        };

        window.clearAllData = async function() {
          if (confirm('Are you sure? This will permanently delete ALL data!')) {
            if (confirm('This cannot be undone. Are you absolutely sure?')) {
              await offlineAPI.clearAllData();
              await updateStats();
              await updateSessionList();
              alert('All data has been cleared.');
            }
          }
        };

        function formatBytes(bytes) {
          if (bytes === 0) return '0 B';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        init();
      </script>
    </body>
    </html>
  `;
}
