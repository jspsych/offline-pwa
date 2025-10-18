import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  init,
  createSession,
  saveTrial,
  finalizeSession,
  getSessionCount,
  getCompletedSessionCount,
  getAllSessions,
  getSessionTrials,
  deleteSession,
  clearAllData,
} from "../src/storage";

describe("storage", () => {
  let db: any;

  beforeEach(async () => {
    db = await init("test-db-" + Date.now());
  });

  describe("session management", () => {
    it("should create a new session", async () => {
      const sessionId = "test-session-1";
      await createSession(db, sessionId, { participant: "P001" });

      const sessions = await getAllSessions(db);
      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe(sessionId);
      expect(sessions[0].completed).toBe(false);
      expect(sessions[0].metadata.participant).toBe("P001");
    });

    it("should count sessions correctly", async () => {
      expect(await getSessionCount(db)).toBe(0);

      await createSession(db, "session-1");
      expect(await getSessionCount(db)).toBe(1);

      await createSession(db, "session-2");
      expect(await getSessionCount(db)).toBe(2);
    });

    it("should finalize a session", async () => {
      const sessionId = "test-session";
      await createSession(db, sessionId);

      expect(await getCompletedSessionCount(db)).toBe(0);

      await finalizeSession(db, sessionId);

      expect(await getCompletedSessionCount(db)).toBe(1);

      const sessions = await getAllSessions(db);
      expect(sessions[0].completed).toBe(true);
      expect(sessions[0].endTime).toBeDefined();
    });
  });

  describe("trial data", () => {
    it("should save trial data", async () => {
      const sessionId = "test-session";
      await createSession(db, sessionId);

      const trialData = { rt: 500, correct: true, stimulus: "A" };
      await saveTrial(db, sessionId, 0, trialData);

      const trials = await getSessionTrials(db, sessionId);
      expect(trials).toHaveLength(1);
      expect(trials[0].sessionId).toBe(sessionId);
      expect(trials[0].trialIndex).toBe(0);
      expect(trials[0].data).toEqual(trialData);
    });

    it("should update session trial count", async () => {
      const sessionId = "test-session";
      await createSession(db, sessionId);

      await saveTrial(db, sessionId, 0, { rt: 500 });
      await saveTrial(db, sessionId, 1, { rt: 600 });
      await saveTrial(db, sessionId, 2, { rt: 550 });

      const sessions = await getAllSessions(db);
      expect(sessions[0].trialCount).toBe(3);
    });
  });

  describe("data deletion", () => {
    it("should delete a session and its trials", async () => {
      const sessionId = "test-session";
      await createSession(db, sessionId);
      await saveTrial(db, sessionId, 0, { rt: 500 });
      await saveTrial(db, sessionId, 1, { rt: 600 });

      expect(await getSessionCount(db)).toBe(1);
      expect((await getSessionTrials(db, sessionId)).length).toBe(2);

      await deleteSession(db, sessionId);

      expect(await getSessionCount(db)).toBe(0);
      expect((await getSessionTrials(db, sessionId)).length).toBe(0);
    });

    it("should clear all data", async () => {
      await createSession(db, "session-1");
      await saveTrial(db, "session-1", 0, { rt: 500 });
      await createSession(db, "session-2");
      await saveTrial(db, "session-2", 0, { rt: 600 });

      expect(await getSessionCount(db)).toBe(2);

      await clearAllData(db);

      expect(await getSessionCount(db)).toBe(0);
    });
  });
});
