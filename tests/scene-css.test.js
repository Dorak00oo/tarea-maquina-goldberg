const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets/css/sections/scene.css'), 'utf8');

function countMatches(pattern) {
  return [...css.matchAll(pattern)].length;
}

assert.equal(countMatches(/^\.scene\s*\{/gm), 1, 'scene.css should define .scene once');
assert.equal(countMatches(/^\.scene-stage\s*\{/gm), 1, 'scene.css should define .scene-stage once');
assert.equal(countMatches(/^\.ball\s*\{/gm), 1, 'scene.css should define .ball once');
assert.equal(countMatches(/^\.switch\s*\{/gm), 1, 'scene.css should define .switch once');
assert.equal(countMatches(/^\.led\s*\{/gm), 1, 'scene.css should define .led once');

assert.equal(css.includes('@keyframes ball-path'), false, 'legacy CSS ball animation should not be present');
assert.equal(css.includes('@keyframes lever-swing'), false, 'legacy lever animation should not be present');
assert.equal(css.includes('@keyframes bucket-drop'), false, 'legacy bucket animation should not be present');

console.log('scene CSS tests passed');
