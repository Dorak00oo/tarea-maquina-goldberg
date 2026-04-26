# Goldberg JS Physics Design

## Goal

Improve the current Goldberg machine page so the animation shows visible cause-and-effect interactions, not only a decorative route. The project remains a static HTML/CSS/JS site with no external physics library.

## Current State

`index.html` renders one scene with static mechanisms and a CSS-only ball path. Some parts animate on the same timeline, but there is no clear visual collision or state transfer between the ball, lever, bucket, switch, and LED.

## Chosen Approach

Use lightweight JavaScript with `requestAnimationFrame` to drive a deterministic sequence. The simulation will use stages, positions, velocities, simple gravity, and coordinate-based contact checks. CSS will provide the appearance of the machine, while JavaScript updates transforms and active states.

## Machine Behavior

The scene should show seven sequential stages:

1. A ball starts on an inclined rail and accelerates along the ramp.
2. A falling weight drops and transfers energy into the next section.
3. The ball continues through a curved/ramp section with increasing speed.
4. The ball exits toward a pendulum and visibly collides with it.
5. The pendulum swings and strikes a gear.
6. The gear rotates and compresses/releases a spring.
7. The released ball bounces, follows a short parabolic arc, presses the switch, and turns on the LED.

## Visual Requirements

The improved scene should make physical interactions readable:

- Contacts should occur at believable positions.
- Mechanisms should react only after the previous interaction.
- The active step should be visible in the sequence list.
- Restart and pause/resume controls should still work.
- The final LED state should clearly indicate success.

## Implementation Boundaries

No external libraries are needed. The simulation can be approximate and educational rather than a full rigid-body physics engine. The page should continue to work as a static site and remain compatible with the existing `npm start` workflow.

## Verification

Manual verification will use the local static server. Automated tests are not currently configured in this project, so the code should keep behavior small and inspectable.
