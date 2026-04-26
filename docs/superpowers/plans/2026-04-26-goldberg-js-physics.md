# Goldberg JS Physics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the decorative CSS-only machine animation with a deterministic JS-driven simulation that shows staged physical interactions.

**Architecture:** Move the simulation into `assets/js/goldberg-simulation.js`. Keep CSS responsible for layout and visual states, while JS updates custom properties, transforms, stage labels, pause/restart state, and collision-triggered reactions. Add a small Node test file for pure helpers and stage progression because the project has no test setup today.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node built-in `assert`.

---

## File Structure

- Modify `index.html`: add richer scene elements, stage labels, and load the JS simulation file.
- Modify `assets/css/sections/scene.css`: replace timeline-only animations with positioned mechanisms and state classes.
- Create `assets/js/goldberg-simulation.js`: own animation loop, stage state, pause/restart controls, and pure helper exports for tests.
- Create `tests/goldberg-simulation.test.js`: verify helper behavior and stage state transitions.
- Modify `package.json`: add a `test` script using Node.

### Task 1: Add Test Harness

**Files:**
- Create: `tests/goldberg-simulation.test.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

```javascript
const assert = require('node:assert/strict');
const { clamp, rectsOverlap, getStageForProgress } = require('../assets/js/goldberg-simulation.js');

assert.equal(clamp(12, 0, 10), 10);
assert.equal(clamp(-2, 0, 10), 0);
assert.equal(clamp(4, 0, 10), 4);

assert.equal(
  rectsOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 9, width: 4, height: 4 }),
  true
);
assert.equal(
  rectsOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 12, y: 12, width: 4, height: 4 }),
  false
);

assert.equal(getStageForProgress(0.02).id, 1);
assert.equal(getStageForProgress(0.22).id, 2);
assert.equal(getStageForProgress(0.42).id, 4);
assert.equal(getStageForProgress(0.72).id, 6);
assert.equal(getStageForProgress(0.91).id, 7);

console.log('goldberg simulation tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `npm test` does not exist or `assets/js/goldberg-simulation.js` does not exist.

- [ ] **Step 3: Add minimal test script**

```json
"scripts": {
  "start": "npx --yes serve . -p 3000",
  "test": "node tests/goldberg-simulation.test.js"
}
```

### Task 2: Implement Testable Simulation Helpers

**Files:**
- Create: `assets/js/goldberg-simulation.js`
- Test: `tests/goldberg-simulation.test.js`

- [ ] **Step 1: Write minimal helper implementation**

Create `assets/js/goldberg-simulation.js` with `clamp`, `rectsOverlap`, `getStageForProgress`, and CommonJS/browser exports.

- [ ] **Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS and output `goldberg simulation tests passed`.

### Task 3: Upgrade Scene Markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace scene internals**

Add physical elements for rail, falling weight, helix/curve, pendulum, gear, spring, launcher ball, switch, LED, impact flashes, and a visible stage label.

- [ ] **Step 2: Load JS file**

Add `<script src="assets/js/goldberg-simulation.js"></script>` before `</body>` and remove the old inline CSS-animation restart logic.

### Task 4: Replace Scene Styling

**Files:**
- Modify: `assets/css/sections/scene.css`

- [ ] **Step 1: Style the upgraded machine**

Use CSS custom properties such as `--ball-x`, `--ball-y`, `--pendulum-angle`, `--gear-rotation`, `--spring-scale`, and `--weight-y`.

- [ ] **Step 2: Add active states**

Style `data-stage`, `.is-lit`, `.is-pressed`, `.is-impacting`, and paused states so the machine visibly reacts.

### Task 5: Wire Runtime Simulation

**Files:**
- Modify: `assets/js/goldberg-simulation.js`
- Modify: `index.html`

- [ ] **Step 1: Implement DOM binding**

On `DOMContentLoaded`, locate the scene and update CSS variables each frame using `requestAnimationFrame`.

- [ ] **Step 2: Implement pause/restart**

Connect `#btn-restart` and `#btn-pause` to reset elapsed time and pause the loop.

- [ ] **Step 3: Implement stage highlighting**

Update `data-stage`, stage label text, and matching `.step` active classes.

### Task 6: Verify

**Files:**
- Test: `tests/goldberg-simulation.test.js`
- Manual: `index.html`

- [ ] **Step 1: Run automated test**

Run: `npm test`
Expected: PASS.

- [ ] **Step 2: Run local server**

Run: `npm start`
Expected: local static server starts on `http://localhost:3000`.

- [ ] **Step 3: Manual browser check**

Confirm the ball moves through stages, collisions trigger mechanism reactions, pause/restart work, sequence steps highlight, and the LED lights after the switch press.
