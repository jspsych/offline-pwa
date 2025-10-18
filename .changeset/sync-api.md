---
"@jspsych/offline-storage": minor
---

Make initJsPsychOffline synchronous and remove UI helpers. initJsPsychOffline now returns immediately like initJsPsych, with database initialization happening in the background. Removed autoShowCompletionScreen option and UI helper functions - researchers should handle completion using standard jsPsych methods.
