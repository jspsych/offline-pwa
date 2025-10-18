---
"@jspsych/new-pwa": patch
---

Fix version generation by creating version.ts at build time instead of reading from offline-storage package.json at runtime, resolving ENOENT error when using npx
