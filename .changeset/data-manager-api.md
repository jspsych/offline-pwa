---
"@jspsych/offline-storage": minor
"@jspsych/new-pwa": minor
---

Add getOfflineDataManager() function to access offline API without creating a new session. Admin templates now use this function instead of initJsPsychOffline() to avoid creating spurious sessions.
