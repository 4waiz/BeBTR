import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useInView, animate } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaPlay, FaChartLine, FaArrowDown } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

/* ----------------------------------------------------------- animations */

const drift = keyframes`
  0%   { transform: translate3d(0,0,0) scale(1); }
  50%  { transform: translate3d(4%, -6%, 0) scale(1.15); }
  100% { transform: translate3d(0,0,0) scale(1); }
`;

const drift2 = keyframes`
  0%   { transform: translate3d(0,0,0) scale(1.1); }
  50%  { transform: translate3d(-5%, 5%, 0) scale(1); }
  100% { transform: translate3d(0,0,0) scale(1.1); }
`;

const float = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

/* ----------------------------------------------------------- layout */

const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  background: linear-gradient(180deg, #0a1a2e 0%, #0f2540 55%, #143456 100%);
  padding: 150px 1.5rem 90px;
  scroll-margin-top: 72px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Aurora = styled.div`
  position: absolute;
  inset: -20%;
  z-index: -2;
  filter: blur(60px);
  opacity: 0.55;

  &:before,
  &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  &:before {
    width: 55vw;
    height: 55vw;
    top: -10%;
    left: -5%;
    background: radial-gradient(circle, #1f8e8e 0%, transparent 65%);
    animation: ${drift} 16s ease-in-out infinite;
  }
  &:after {
    width: 50vw;
    height: 50vw;
    bottom: -15%;
    right: -8%;
    background: radial-gradient(circle, #2f6df0 0%, transparent 65%);
    animation: ${drift2} 19s ease-in-out infinite;
  }
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%);
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoBlock = styled(motion.div)`
  margin-bottom: 1.4rem;
  animation: ${float} 6s ease-in-out infinite;
`;

const LogoImg = styled.img`
  width: 74px;
  height: 74px;
  object-fit: contain;
  border-radius: 16px;
  background: #fff;
  padding: 7px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
`;

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: rgba(31, 142, 142, 0.18);
  border: 1px solid rgba(31, 142, 142, 0.4);
  color: #8fe3e3;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 1.4rem;
  backdrop-filter: blur(4px);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.1rem, 5vw, 3.6rem);
  color: #fff;
  line-height: 1.12;
  max-width: 920px;
  margin-bottom: 1.1rem;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(100deg, #2ee6e6 0%, #6aa8ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.6vw, 1.22rem);
  color: rgba(226, 240, 248, 0.86);
  max-width: 720px;
  margin: 0 auto 1.9rem;
  line-height: 1.6;
`;

const Badges = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
  margin-bottom: 2.1rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2f0f8;
  backdrop-filter: blur(4px);
`;

const HighlightBadge = styled(Badge)`
  background: #1f8e8e;
  border-color: #1f8e8e;
  color: #fff;
`;

const CTARow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  margin-bottom: 3rem;
`;

const buttonBase = `
  padding: 0.9rem 1.6rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
`;

const PrimaryCTA = styled(ScrollLink)`
  ${buttonBase}
  background: linear-gradient(100deg, #1f8e8e, #2bb3b3);
  color: #fff;
  box-shadow: 0 10px 30px rgba(31, 142, 142, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(31, 142, 142, 0.55);
    text-decoration: none;
  }
`;

const SecondaryCTA = styled(ScrollLink)`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.16);
    text-decoration: none;
  }
`;

/* ----------------------------------------------------------- stats */

const Stats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 2.5rem;
  padding: 1.4rem 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 2rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNum = styled.div`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1;

  span {
    color: #2ee6e6;
  }
`;

const StatLabel = styled.div`
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(226, 240, 248, 0.7);
  margin-top: 0.4rem;
`;

const ScrollHint = styled(motion.div)`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.1rem;
  z-index: 1;
`;

function Counter({ to, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val}
      <span>{suffix}</span>
    </span>
  );
}

const stats = [
  { to: 1, suffix: 'st', label: 'Place — Smart Health Hackathon' },
  { to: 40, suffix: 'k', label: 'AED in award funding' },
  { to: 30, suffix: 'fps', label: 'Real-time on-device analysis' },
  { to: 100, suffix: '%', label: 'Private — runs in your browser' },
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.1 },
  }),
};

function Hero() {
  return (
    <HeroSection id="home">
      <Aurora />
      <Grid />
      <Inner>
        <LogoBlock
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <LogoImg src={Logo} alt="BeBTR logo" />
        </LogoBlock>

        <Eyebrow custom={0} variants={fade} initial="hidden" animate="show">
          ✦ Dubai Foresight Awards · Foresight for People
        </Eyebrow>

        <Title custom={1} variants={fade} initial="hidden" animate="show">
          Preventive fitness, <span>powered by AI</span> that sees every move
        </Title>

        <Subtitle custom={2} variants={fade} initial="hidden" animate="show">
          BeBTR turns any camera into a real-time form coach — detecting unsafe
          movement and correcting posture before injuries happen. Try the live
          AI demo right here in your browser.
        </Subtitle>

        <Badges custom={3} variants={fade} initial="hidden" animate="show">
          <HighlightBadge>Foresight for People</HighlightBadge>
          <Badge>Smart Health Hackathon — 1st Place</Badge>
          <Badge>Department of Health Category</Badge>
          <Badge>Abu Dhabi, UAE</Badge>
        </Badges>

        <CTARow custom={4} variants={fade} initial="hidden" animate="show">
          <PrimaryCTA to="demo" smooth duration={500} offset={-72}>
            <FaPlay /> Try the Demo
          </PrimaryCTA>
          <SecondaryCTA to="impact" smooth duration={500} offset={-72}>
            <FaChartLine /> View Impact Evidence
          </SecondaryCTA>
        </CTARow>

        <Stats custom={5} variants={fade} initial="hidden" animate="show">
          {stats.map((s) => (
            <StatItem key={s.label}>
              <StatNum>
                <Counter to={s.to} suffix={s.suffix} />
              </StatNum>
              <StatLabel>{s.label}</StatLabel>
            </StatItem>
          ))}
        </Stats>
      </Inner>

      <ScrollHint
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <FaArrowDown />
      </ScrollHint>
    </HeroSection>
  );
}

export default Hero;
