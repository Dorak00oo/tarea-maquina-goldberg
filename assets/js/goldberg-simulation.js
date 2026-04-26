(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.GoldbergSimulation = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  const STAGES = [
    { id: 1, start: 0, label: '1. Riel: movimiento rectilíneo y deslizante' },
    { id: 2, start: 0.18, label: '2. Peso: caída libre que impulsa la canica' },
    { id: 3, start: 0.3, label: '3. Rampa: aceleración por gravedad' },
    { id: 4, start: 0.42, label: '4. Curva: trayectoria circular hacia el péndulo' },
    { id: 5, start: 0.56, label: '5. Choque: el péndulo empieza a oscilar' },
    { id: 6, start: 0.7, label: '6. Engrane: rotación que comprime el resorte' },
    { id: 7, start: 0.84, label: '7. Rebote parabólico: interruptor y LED' },
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function rectsOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function getStageForProgress(progress) {
    const bounded = clamp(progress, 0, 1);

    for (let i = STAGES.length - 1; i >= 0; i -= 1) {
      if (bounded >= STAGES[i].start) {
        return STAGES[i];
      }
    }

    return STAGES[0];
  }

  function easeInQuad(value) {
    return value * value;
  }

  function easeOutQuad(value) {
    return 1 - (1 - value) * (1 - value);
  }

  function segment(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function projectile(startX, startY, endX, endY, amount, lift) {
    const arc = Math.sin(amount * Math.PI) * lift;

    return {
      x: Math.round(lerp(startX, endX, amount)),
      y: Math.round(lerp(startY, endY, amount) - arc),
    };
  }

  function getFrameState(progress) {
    const bounded = clamp(progress, 0, 1);
    const stage = getStageForProgress(bounded);
    const railT = easeInQuad(segment(bounded, 0, 0.18));
    const dropT = easeInQuad(segment(bounded, 0.18, 0.3));
    const rampT = easeOutQuad(segment(bounded, 0.3, 0.42));
    const curveT = segment(bounded, 0.42, 0.56);
    const pendulumT = segment(bounded, 0.56, 0.7);
    const gearT = segment(bounded, 0.7, 0.84);
    const launchT = easeOutQuad(segment(bounded, 0.84, 0.96));
    let ball = { x: 38, y: 46 };

    if (bounded < 0.18) {
      ball = {
        x: Math.round(lerp(38, 232, railT)),
        y: Math.round(lerp(68, 96, railT)),
      };
    } else if (bounded < 0.3) {
      ball = {
        x: 232,
        y: Math.round(lerp(96, 168, dropT)),
      };
    } else if (bounded < 0.42) {
      ball = {
        x: Math.round(lerp(232, 385, rampT)),
        y: Math.round(lerp(168, 210, rampT)),
      };
    } else if (bounded < 0.56) {
      ball = {
        x: Math.round(lerp(385, 510, curveT)),
        y: Math.round(210 + Math.sin(curveT * Math.PI) * 28),
      };
    } else if (bounded < 0.7) {
      const transferT = easeOutQuad(segment(bounded, 0.6, 0.7));

      ball = {
        x: Math.round(lerp(510, 612, transferT)),
        y: Math.round(lerp(210, 214, transferT)),
      };
    } else if (bounded < 0.84) {
      ball = {
        x: Math.round(lerp(612, 668, gearT)),
        y: Math.round(lerp(214, 222, gearT)),
      };
    } else {
      ball = projectile(668, 222, 764, 212, launchT, 70);
    }

    const pendulumAngle =
      pendulumT === 0 ? 0 : Math.round(Math.sin(pendulumT * Math.PI * 1.65) * 32);
    const springScale =
      gearT === 0 ? 1 : Number((1 - Math.sin(gearT * Math.PI) * 0.42).toFixed(2));
    const switchPress = bounded > 0.9 ? Math.round(lerp(0, 28, segment(bounded, 0.9, 0.96))) : 0;

    return {
      stage,
      ball,
      ballRotation: Math.round(bounded * 1440),
      weightY: Math.round(lerp(0, 104, dropT)),
      pendulumAngle,
      gearRotation: Math.round(gearT * 510),
      springScale,
      switchPress,
      impactOpacity: Number((Math.sin(pendulumT * Math.PI) || 0).toFixed(2)),
      switchImpactOpacity: bounded > 0.9 ? Number(Math.sin(segment(bounded, 0.9, 0.97) * Math.PI).toFixed(2)) : 0,
      complete: bounded >= 0.92,
    };
  }

  function setPx(scene, name, value) {
    scene.style.setProperty(name, `${value}px`);
  }

  function setDeg(scene, name, value) {
    scene.style.setProperty(name, `${value}deg`);
  }

  function renderFrame(scene, frame) {
    const stageLabel = scene.querySelector('[data-stage-label]');
    const switchEl = scene.querySelector('.switch');
    const led = scene.querySelector('.led');

    scene.dataset.stage = String(frame.stage.id);
    scene.classList.toggle('is-complete', frame.complete);
    setPx(scene, '--ball-x', frame.ball.x);
    setPx(scene, '--ball-y', frame.ball.y);
    setDeg(scene, '--ball-rotation', frame.ballRotation);
    setPx(scene, '--weight-y', frame.weightY);
    setDeg(scene, '--pendulum-angle', frame.pendulumAngle);
    setDeg(scene, '--gear-rotation', frame.gearRotation);
    scene.style.setProperty('--spring-scale', frame.springScale);
    setPx(scene, '--switch-press', frame.switchPress);
    scene.style.setProperty('--impact-opacity', frame.impactOpacity);
    scene.style.setProperty('--switch-impact-opacity', frame.switchImpactOpacity);

    if (stageLabel) {
      stageLabel.textContent = frame.stage.label;
    }

    switchEl?.classList.toggle('is-pressed', frame.switchPress > 20);
    led?.classList.toggle('is-lit', frame.complete);

    document.querySelectorAll('[data-step]').forEach((step) => {
      step.classList.toggle('is-active', step.getAttribute('data-step') === String(frame.stage.id));
    });
  }

  function initGoldbergScene() {
    const scene = document.querySelector('.scene');
    const restart = document.getElementById('btn-restart');
    const pause = document.getElementById('btn-pause');

    if (!scene) return;

    const duration = 11000;
    let startTime = 0;
    let pausedAt = 0;
    let paused = false;

    function draw(now) {
      if (!startTime) startTime = now;

      const elapsed = paused ? pausedAt - startTime : now - startTime;
      const progress = (elapsed % duration) / duration;
      renderFrame(scene, getFrameState(progress));

      requestAnimationFrame(draw);
    }

    restart?.addEventListener('click', () => {
      startTime = performance.now();
      pausedAt = startTime;
      paused = false;
      scene.setAttribute('data-paused', 'false');
      if (pause) pause.textContent = 'Pausar';
    });

    pause?.addEventListener('click', () => {
      paused = !paused;
      scene.setAttribute('data-paused', String(paused));

      if (paused) {
        pausedAt = performance.now();
        pause.textContent = 'Reanudar';
      } else {
        const pauseDuration = performance.now() - pausedAt;
        startTime += pauseDuration;
        pause.textContent = 'Pausar';
      }
    });

    renderFrame(scene, getFrameState(0));
    requestAnimationFrame(draw);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initGoldbergScene);
  }

  return {
    STAGES,
    clamp,
    rectsOverlap,
    getStageForProgress,
    getFrameState,
    initGoldbergScene,
  };
});
