import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaStop,
  FaVideo,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaRedo,
} from 'react-icons/fa';
import {
  loadMediaPipe,
  createPose,
  createCamera,
  analyzeSquat,
} from './poseEngine';

/* ------------------------------------------------------------------ styles */

const Shell = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.25rem;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background:
    radial-gradient(120% 120% at 50% 0%, #112c4e 0%, #0a1a2e 60%, #060f1c 100%);
  overflow: hidden;
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  pointer-events: none;
`;

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  color: #cde3e3;
  text-align: center;
  padding: 2rem;
`;

const PulseRing = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  color: #fff;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 0 0 rgba(31, 142, 142, 0.7);
  animation: ${keyframes`
    0% { box-shadow: 0 0 0 0 rgba(31,142,142,0.55); }
    70% { box-shadow: 0 0 0 22px rgba(31,142,142,0); }
    100% { box-shadow: 0 0 0 0 rgba(31,142,142,0); }
  `} 2s infinite;
`;

const LiveTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(197, 48, 48, 0.92);
  color: #fff;
  z-index: 3;

  &:before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    animation: ${keyframes`50% { opacity: 0.25; }`} 1s infinite;
  }
`;

const PhaseTag = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  z-index: 3;
  color: #fff;
  background: ${({ $phase }) =>
    $phase === 'down' ? 'rgba(31,142,142,0.92)' : 'rgba(15,37,64,0.85)'};
`;

const Controls = styled.div`
  display: flex;
  gap: 0.7rem;
  padding: 1rem 1.1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  align-items: center;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.18s ease;
`;

const StartBtn = styled.button`
  ${buttonBase}
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  &:hover:not(:disabled) {
    background: #19797a;
  }
  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`;

const StopBtn = styled.button`
  ${buttonBase}
  background: #fff;
  color: ${({ theme }) => theme.colors.danger};
  border-color: ${({ theme }) => theme.colors.border};
  &:hover {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

const GhostBtn = styled.button`
  ${buttonBase}
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.border};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ExerciseHint = styled.span`
  margin-left: auto;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.muted};
`;

/* coach side panel */

const Coach = styled(Panel)`
  padding: 1.25rem 1.25rem 1.4rem;
  gap: 1rem;
`;

const CoachHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const CoachIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
`;

const CoachTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.2;
`;

const CoachSub = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
`;

const Stat = styled.div`
  background: ${({ theme }) => theme.colors.light};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.7rem 0.5rem;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.3rem;
`;

const ScoreWrap = styled.div``;

const ScoreTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
`;

const ScoreLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ScoreVal = styled.span`
  font-weight: 800;
  font-size: 1.05rem;
  color: ${({ $v, theme }) =>
    $v == null
      ? theme.colors.muted
      : $v >= 85
      ? theme.colors.success
      : $v >= 70
      ? theme.colors.warning
      : theme.colors.danger};
`;

const Track = styled.div`
  height: 9px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Fill = styled(motion.div)`
  height: 100%;
  border-radius: 999px;
  background: ${({ $v, theme }) =>
    $v == null
      ? theme.colors.muted
      : $v >= 85
      ? theme.colors.success
      : $v >= 70
      ? theme.colors.warning
      : theme.colors.danger};
`;

const CueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 96px;
`;

const toneMap = {
  good: { c: '#2F855A', bg: '#F0FDF4', icon: <FaCheckCircle /> },
  bad: { c: '#C53030', bg: '#FEF2F2', icon: <FaExclamationTriangle /> },
  warn: { c: '#B7791F', bg: '#FFFBEB', icon: <FaExclamationTriangle /> },
  info: { c: '#1F8E8E', bg: '#E6F2F2', icon: <FaInfoCircle /> },
};

const Cue = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.4;
  background: ${({ $tone }) => toneMap[$tone].bg};
  color: ${({ $tone }) => toneMap[$tone].c};
  border: 1px solid ${({ $tone }) => toneMap[$tone].c}22;

  svg {
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const Privacy = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  padding-top: 0.8rem;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 10px;
  padding: 0.8rem 0.9rem;
  font-size: 0.88rem;
`;

/* ------------------------------------------------------------------ logic */

const SKELETON = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28],
];

function LiveDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const analysisStateRef = useRef({ phase: 'up', reps: 0, goodReps: 0 });

  const [status, setStatus] = useState('idle'); // idle | loading | running | error
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    reps: 0,
    goodReps: 0,
    score: null,
    depthPct: 0,
    phase: 'up',
    kneeAngle: null,
    cues: [
      {
        tone: 'info',
        text: 'Press “Start live coaching”, allow your camera, then perform slow bodyweight squats facing the camera.',
      },
    ],
  });

  const drawResults = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    const w = video.videoWidth || 960;
    const h = video.videoHeight || 720;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    const lm = results.poseLandmarks;
    if (!lm) return;

    const px = (p) => ({ x: p.x * w, y: p.y * h });

    // Connections — use our own index-pair list (stable across MediaPipe
    // builds, where window.POSE_CONNECTIONS may be a Set of {start,end}).
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const cons = SKELETON;

    // Run analysis first so we can color the skeleton by form quality.
    const result = analyzeSquat(lm, analysisStateRef.current);
    analysisStateRef.current = result.state;

    const lineColor =
      result.score == null
        ? 'rgba(120,190,190,0.9)'
        : result.score >= 85
        ? 'rgba(56,178,108,0.95)'
        : result.score >= 70
        ? 'rgba(183,121,31,0.95)'
        : 'rgba(229,72,72,0.95)';

    ctx.strokeStyle = lineColor;
    cons.forEach(([a, b]) => {
      const pa = lm[a];
      const pb = lm[b];
      if (!pa || !pb) return;
      if ((pa.visibility ?? 1) < 0.4 || (pb.visibility ?? 1) < 0.4) return;
      const A = px(pa);
      const B = px(pb);
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.stroke();
    });

    // Joints
    [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach((i) => {
      const p = lm[i];
      if (!p || (p.visibility ?? 1) < 0.4) return;
      const P = px(p);
      ctx.beginPath();
      ctx.arc(P.x, P.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    });

    setMetrics({
      reps: result.reps,
      goodReps: result.goodReps,
      score: result.score,
      depthPct: result.depthPct,
      phase: result.phase,
      kneeAngle: result.kneeAngle,
      cues: result.cues,
    });
  }, []);

  const stop = useCallback(() => {
    try {
      cameraRef.current?.stop?.();
    } catch (_) {}
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus('loading');
    try {
      await loadMediaPipe();

      if (!poseRef.current) {
        poseRef.current = createPose(drawResults);
      }
      const pose = poseRef.current;

      cameraRef.current = createCamera(videoRef.current, async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          await pose.send({ image: videoRef.current });
        }
      });

      await cameraRef.current.start();
      setStatus('running');
    } catch (e) {
      console.error(e);
      const msg =
        e && e.name === 'NotAllowedError'
          ? 'Camera permission was denied. Enable camera access for this site and try again.'
          : e && e.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : 'Could not start the live demo. This requires a camera and a secure (https / localhost) connection. The recorded demo below works everywhere.';
      setError(msg);
      setStatus('error');
    }
  }, [drawResults]);

  const reset = useCallback(() => {
    analysisStateRef.current = { phase: 'up', reps: 0, goodReps: 0 };
    setMetrics((m) => ({ ...m, reps: 0, goodReps: 0, score: null, depthPct: 0 }));
  }, []);

  useEffect(() => () => stop(), [stop]);

  const running = status === 'running';
  const loading = status === 'loading';
  const accuracy =
    metrics.reps > 0
      ? Math.round((metrics.goodReps / metrics.reps) * 100)
      : null;

  return (
    <div>
      <Shell>
        <Panel>
          <Stage>
            <Video ref={videoRef} $on={running} playsInline muted />
            <Canvas ref={canvasRef} />

            {running && <LiveTag>LIVE · ON-DEVICE AI</LiveTag>}
            {running && (
              <PhaseTag $phase={metrics.phase}>
                {metrics.phase === 'down' ? 'Squat' : 'Stand'}
              </PhaseTag>
            )}

            {!running && (
              <Placeholder>
                <PulseRing>
                  <FaVideo />
                </PulseRing>
                <div style={{ fontWeight: 700, color: '#fff' }}>
                  {loading ? 'Loading AI pose model…' : 'Live AI Form Coach'}
                </div>
                <div style={{ fontSize: '0.85rem', maxWidth: 320, opacity: 0.9 }}>
                  {loading
                    ? 'Fetching the on-device model from the CDN — first load takes a few seconds.'
                    : 'Real-time squat analysis using on-device computer vision. Nothing is uploaded.'}
                </div>
              </Placeholder>
            )}
          </Stage>

          <Controls>
            {!running ? (
              <StartBtn onClick={start} disabled={loading}>
                <FaPlay /> {loading ? 'Loading…' : 'Start live coaching'}
              </StartBtn>
            ) : (
              <StopBtn onClick={stop}>
                <FaStop /> Stop
              </StopBtn>
            )}
            <GhostBtn onClick={reset} disabled={loading}>
              <FaRedo /> Reset reps
            </GhostBtn>
            <ExerciseHint>Exercise: Bodyweight squat</ExerciseHint>
          </Controls>
        </Panel>

        <Coach>
          <CoachHead>
            <CoachIcon>
              <FaRobot />
            </CoachIcon>
            <div>
              <CoachTitle>BeBTR AI Coach</CoachTitle>
              <CoachSub>Real-time movement feedback</CoachSub>
            </div>
          </CoachHead>

          <StatRow>
            <Stat>
              <StatNum>{metrics.reps}</StatNum>
              <StatLabel>Reps</StatLabel>
            </Stat>
            <Stat>
              <StatNum>{metrics.goodReps}</StatNum>
              <StatLabel>Clean reps</StatLabel>
            </Stat>
            <Stat>
              <StatNum>{accuracy == null ? '—' : `${accuracy}%`}</StatNum>
              <StatLabel>Quality</StatLabel>
            </Stat>
          </StatRow>

          <ScoreWrap>
            <ScoreTop>
              <ScoreLabel>Live form score</ScoreLabel>
              <ScoreVal $v={metrics.score}>
                {metrics.score == null ? '—' : metrics.score}
              </ScoreVal>
            </ScoreTop>
            <Track>
              <Fill
                $v={metrics.score}
                animate={{ width: `${metrics.score == null ? 0 : metrics.score}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </Track>
          </ScoreWrap>

          <ScoreWrap>
            <ScoreTop>
              <ScoreLabel>Squat depth</ScoreLabel>
              <ScoreVal $v={metrics.depthPct}>
                {running ? `${metrics.depthPct}%` : '—'}
              </ScoreVal>
            </ScoreTop>
            <Track>
              <Fill
                $v={metrics.depthPct}
                animate={{ width: `${running ? metrics.depthPct : 0}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </Track>
          </ScoreWrap>

          <CueList>
            <AnimatePresence initial={false}>
              {metrics.cues.map((cue, i) => (
                <Cue
                  key={`${cue.tone}-${cue.text}-${i}`}
                  $tone={cue.tone}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {toneMap[cue.tone].icon}
                  <span>{cue.text}</span>
                </Cue>
              ))}
            </AnimatePresence>
          </CueList>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Privacy>
            <strong>Private by design:</strong> all pose analysis runs locally in
            your browser using on-device computer vision. No video, image, or
            body data ever leaves your device.
          </Privacy>
        </Coach>
      </Shell>
    </div>
  );
}

export default LiveDemo;
