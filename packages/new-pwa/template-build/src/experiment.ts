import { initJsPsychOffline } from "@jspsych/offline-storage";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import preload from "@jspsych/plugin-preload";

// Initialize jsPsych with offline storage
const jsPsych = initJsPsychOffline();

// Preload any assets
const preloadTrial = {
  type: preload,
  images: [],
};

// Welcome screen
const welcome = {
  type: htmlKeyboardResponse,
  stimulus: `
    <h1>Welcome to the experiment!</h1>
    <p>This is an offline jsPsych experiment that saves data locally on your device.</p>
    <p>Press any key to begin.</p>
  `,
};

// Instructions
const instructions = {
  type: htmlKeyboardResponse,
  stimulus: `
    <h2>Instructions</h2>
    <p>You will be presented with a series of stimuli.</p>
    <p>Press <strong>F</strong> if you see the letter A.</p>
    <p>Press <strong>J</strong> if you see the letter B.</p>
    <p>Try to respond as quickly and accurately as possible.</p>
    <p>Press any key to start.</p>
  `,
};

// Test trials
const testStimuli = [
  { stimulus: "A", correct_response: "f" },
  { stimulus: "B", correct_response: "j" },
  { stimulus: "A", correct_response: "f" },
  { stimulus: "B", correct_response: "j" },
];

const testTrial = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return `<div style="font-size: 60px;">${jsPsych.evaluateTimelineVariable("stimulus")}</div>`;
  },
  choices: ["f", "j"],
  data: {
    task: "response",
    correct_response: jsPsych.evaluateTimelineVariable("correct_response"),
  },
  on_finish: (data: any) => {
    data.correct = data.response === data.correct_response;
  },
};

const testProcedure = {
  timeline: [testTrial],
  timeline_variables: testStimuli,
  randomize_order: true,
};

// Debrief
const debrief = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const trials = jsPsych.data.get().filter({ task: "response" });
    const correct_trials = trials.filter({ correct: true });
    const accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
    const rt = Math.round(correct_trials.select("rt").mean());

    return `
      <h2>You're done!</h2>
      <p>Your accuracy: <strong>${accuracy}%</strong></p>
      <p>Your average response time: <strong>${rt}ms</strong></p>
      <p>Press any key to complete the experiment.</p>
    `;
  },
};

// Create timeline
const timeline = [preloadTrial, welcome, instructions, testProcedure, debrief];

// Run experiment
jsPsych.run(timeline);
