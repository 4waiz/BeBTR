// poseEngine.js
// Loads MediaPipe Pose + Camera utilities from CDN (online resources) on demand,
// runs real-time pose estimation in the browser, and exposes a small API so the
// React component stays declarative. No build-time dependency is added — every
// asset is fetched from the jsDelivr CDN at runtime.

const CDN = {
  pose: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js',
  cameraUtils:
    'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js',
  drawingUtils:
    'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js',
  files: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404',
};

const loaded = new Set();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (loaded.has(src)) return resolve();
    const existing = document.querySelector(`script[data-mp="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error(`Failed to load ${src}`))
      );
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.crossOrigin = 'anonymous';
    el.dataset.mp = src;
    el.onload = () => {
      loaded.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

export async function loadMediaPipe() {
  // pose.js must load before camera/drawing utils reference it.
  await loadScript(CDN.pose);
  await Promise.all([loadScript(CDN.cameraUtils), loadScript(CDN.drawingUtils)]);
  if (!window.Pose || !window.Camera) {
    throw new Error('MediaPipe globals not available after load.');
  }
}

// Pose landmark indices we care about (BlazePose 33-point model).
export const LM = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
};

// Angle at point B formed by A-B-C, in degrees.
export function angle(a, b, c) {
  if (!a || !b || !c) return null;
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  if (magAB === 0 || magCB === 0) return null;
  let cos = dot / (magAB * magCB);
  cos = Math.max(-1, Math.min(1, cos));
  return (Math.acos(cos) * 180) / Math.PI;
}

function avg(a, b) {
  if (a == null && b == null) return null;
  if (a == null) return b;
  if (b == null) return a;
  return (a + b) / 2;
}

// Create a Pose instance configured for live webcam use.
export function createPose(onResults) {
  // eslint-disable-next-line no-undef
  const pose = new window.Pose({
    locateFile: (file) => `${CDN.files}/${file}`,
  });
  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });
  pose.onResults(onResults);
  return pose;
}

export function createCamera(videoEl, onFrame) {
  // eslint-disable-next-line no-undef
  return new window.Camera(videoEl, {
    onFrame,
    width: 960,
    height: 720,
  });
}

// ---- Squat form analysis ---------------------------------------------------
// Pure function: takes raw landmarks, returns a structured analysis the
// component renders. This is the "AI coach" rule engine — interpretable,
// runs at 30fps, and mirrors what BeBTR does on real hardware.

export function analyzeSquat(lm, state) {
  const get = (i) => (lm && lm[i] && lm[i].visibility > 0.5 ? lm[i] : null);

  const lHip = get(LM.leftHip);
  const rHip = get(LM.rightHip);
  const lKnee = get(LM.leftKnee);
  const rKnee = get(LM.rightKnee);
  const lAnkle = get(LM.leftAnkle);
  const rAnkle = get(LM.rightAnkle);
  const lShoulder = get(LM.leftShoulder);
  const rShoulder = get(LM.rightShoulder);

  const leftKneeAngle = angle(lHip, lKnee, lAnkle);
  const rightKneeAngle = angle(rHip, rKnee, rAnkle);
  const kneeAngle = avg(leftKneeAngle, rightKneeAngle);

  // Hip angle (shoulder-hip-knee) tells us about torso / back lean.
  const leftHipAngle = angle(lShoulder, lHip, lKnee);
  const rightHipAngle = angle(rShoulder, rHip, rKnee);
  const hipAngle = avg(leftHipAngle, rightHipAngle);

  const visible =
    kneeAngle != null && hipAngle != null && lShoulder && rShoulder;

  const cues = [];
  let phase = state.phase || 'up';
  let reps = state.reps || 0;
  let goodReps = state.goodReps || 0;
  let lastFault = state.lastFault || false;
  let depthReached = state.depthReached || false;

  if (!visible) {
    return {
      visible: false,
      kneeAngle,
      hipAngle,
      score: null,
      phase,
      reps,
      goodReps,
      cues: [
        {
          tone: 'info',
          text: 'Step back so your hips, knees and ankles are in frame.',
        },
      ],
      depthPct: 0,
      state: { phase, reps, goodReps, lastFault, depthReached },
    };
  }

  // Depth as a 0–100% scale: 170° (standing) -> 0%, 80° (deep) -> 100%.
  const depthPct = Math.max(
    0,
    Math.min(100, Math.round(((170 - kneeAngle) / (170 - 80)) * 100))
  );

  // --- Form rules (the coach) ---
  let formOk = true;

  // 1. Back angle — torso should not collapse forward at the bottom.
  if (phase === 'down' || kneeAngle < 130) {
    if (hipAngle != null && hipAngle < 65) {
      cues.push({ tone: 'bad', text: 'Chest up — you are leaning too far forward.' });
      formOk = false;
    }
  }

  // 2. Knee valgus (caving in) — horizontal knee gap vs hip gap.
  if (lKnee && rKnee && lHip && rHip) {
    const kneeGap = Math.abs(lKnee.x - rKnee.x);
    const hipGap = Math.abs(lHip.x - rHip.x);
    if (kneeGap < hipGap * 0.6 && kneeAngle < 140) {
      cues.push({ tone: 'bad', text: 'Push your knees out — they are caving in.' });
      formOk = false;
    }
  }

  // 3. Rep / depth state machine.
  if (kneeAngle < 100) {
    phase = 'down';
    depthReached = true;
    if (formOk) {
      cues.push({ tone: 'good', text: 'Great depth — drive up through your heels.' });
    }
  } else if (kneeAngle > 160) {
    if (phase === 'down') {
      // Completed a rep on the way back up.
      reps += 1;
      if (depthReached && !lastFault) goodReps += 1;
      depthReached = false;
      lastFault = false;
    }
    phase = 'up';
    if (cues.length === 0) {
      cues.push({ tone: 'info', text: 'Standing tall — begin your next rep.' });
    }
  } else {
    // Mid-range.
    if (phase === 'down' && kneeAngle > 120 && depthReached === false) {
      cues.push({ tone: 'warn', text: 'Go deeper — aim for thighs parallel.' });
    }
  }

  if (!formOk) lastFault = true;

  // --- Live form score (0–100) ---
  let score = 100;
  if (hipAngle != null && hipAngle < 70 && kneeAngle < 130) score -= 25;
  if (lKnee && rKnee && lHip && rHip) {
    const kneeGap = Math.abs(lKnee.x - rKnee.x);
    const hipGap = Math.abs(lHip.x - rHip.x);
    if (kneeGap < hipGap * 0.65 && kneeAngle < 140) score -= 25;
  }
  if (phase === 'down' && kneeAngle > 110) score -= 15; // shallow
  score = Math.max(40, Math.min(100, score));

  if (cues.length === 0) {
    cues.push({ tone: 'good', text: 'Form looks clean — keep it controlled.' });
  }

  return {
    visible: true,
    kneeAngle: Math.round(kneeAngle),
    hipAngle: Math.round(hipAngle),
    depthPct,
    score,
    phase,
    reps,
    goodReps,
    cues: cues.slice(0, 2),
    state: { phase, reps, goodReps, lastFault, depthReached },
  };
}

export const POSE_CONNECTIONS_FALLBACK = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28], [27, 31], [28, 32],
];
