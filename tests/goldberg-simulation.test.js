const assert = require('node:assert/strict');
const {
  clamp,
  rectsOverlap,
  getStageForProgress,
  getFrameState,
} = require('../assets/js/goldberg-simulation.js');

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

const firstFrame = getFrameState(0);
assert.equal(firstFrame.stage.id, 1);
assert.equal(firstFrame.complete, false);
assert.equal(firstFrame.ball.x, 38);

const pendulumFrame = getFrameState(0.6);
assert.equal(pendulumFrame.stage.id, 5);
assert.ok(pendulumFrame.pendulumAngle > 10);
assert.ok(pendulumFrame.impactOpacity > 0);

const finalFrame = getFrameState(0.95);
assert.equal(finalFrame.stage.id, 7);
assert.equal(finalFrame.complete, true);
assert.ok(finalFrame.switchPress > 20);

function distanceBetween(progressA, progressB) {
  const a = getFrameState(progressA).ball;
  const b = getFrameState(progressB).ball;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const rampStart = getFrameState(0.31).ball;
const rampEnd = getFrameState(0.41).ball;
assert.ok(rampEnd.y > rampStart.y, 'stage 3 ball should descend the ramp with gravity');

const curveStart = getFrameState(0.42).ball;
const curveMiddle = getFrameState(0.49).ball;
const curveEnd = getFrameState(0.55).ball;
assert.ok(curveMiddle.x > curveStart.x, 'stage 4 curve should keep moving forward');
assert.ok(curveEnd.x > curveMiddle.x, 'stage 4 curve should not reverse direction');
assert.ok(curveEnd.y >= curveStart.y, 'stage 4 curve should exit level or lower than it enters');

const dropStart = getFrameState(0.181).ball;
const dropEnd = getFrameState(0.299).ball;
assert.ok(Math.abs(dropEnd.x - dropStart.x) <= 16, 'stage 2 free fall should stay nearly vertical');
assert.ok(dropEnd.y > dropStart.y + 55, 'stage 2 free fall should visibly descend');

assert.ok(distanceBetween(0.179, 0.181) < 14, 'stage 1 to 2 should connect without a jump');
assert.ok(distanceBetween(0.299, 0.301) < 14, 'stage 2 to 3 should connect without a jump');
assert.ok(distanceBetween(0.839, 0.841) < 16, 'stage 6 to 7 should connect spring release without a jump');
assert.ok(distanceBetween(0.699, 0.701) < 18, 'stage 5 to 6 should not teleport the ball');

const pendulumImpact = getFrameState(0.56).ball;
assert.ok(pendulumImpact.x >= 505 && pendulumImpact.x <= 535, 'stage 5 impact should happen at the pendulum bob');
assert.ok(pendulumImpact.y >= 202 && pendulumImpact.y <= 224, 'stage 5 impact should be vertically aligned with the bob');

const gearContact = getFrameState(0.72).ball;
assert.ok(gearContact.x >= 610 && gearContact.x <= 640, 'stage 6 should start at the gear contact point');
assert.ok(gearContact.y >= 205 && gearContact.y <= 230, 'stage 6 should stay aligned with gear and spring');

console.log('goldberg simulation tests passed');
