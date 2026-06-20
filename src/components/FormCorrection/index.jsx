import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaVideo, FaFilm } from 'react-icons/fa';
import Section from '../Section';
import LiveDemo from '../LiveDemo';

const Tabs = styled.div`
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.3rem;
  background: ${({ theme }) => theme.colors.light};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 1.75rem;
`;

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.05rem;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.18s ease;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.muted};

  &:hover {
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.primary)};
  }
`;

const VideoWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-width: 900px;
`;

const DemoVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  display: block;
  background-color: #000;
`;

const Caption = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
  text-align: center;
  font-style: italic;
`;

const Fade = styled(motion.div)``;

function FormCorrection() {
  const [tab, setTab] = useState('live');

  return (
    <Section
      id="demo"
      eyebrow="Interactive Demo"
      title="Try the AI Form Coach — live in your browser"
      lede="This is the core of BeBTR, running for real. Allow your camera and the same on-device computer-vision pipeline analyses your squat form, counts your reps, and coaches you in real time — privately, with nothing uploaded."
    >
      <Tabs role="tablist">
        <Tab
          $active={tab === 'live'}
          onClick={() => setTab('live')}
          role="tab"
          aria-selected={tab === 'live'}
        >
          <FaVideo /> Live AI Coach
        </Tab>
        <Tab
          $active={tab === 'video'}
          onClick={() => setTab('video')}
          role="tab"
          aria-selected={tab === 'video'}
        >
          <FaFilm /> Recorded walkthrough
        </Tab>
      </Tabs>

      {tab === 'live' ? (
        <Fade
          key="live"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LiveDemo />
        </Fade>
      ) : (
        <Fade
          key="video"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <VideoWrap>
            <DemoVideo
              src={`${process.env.PUBLIC_URL}/Videos/form.mp4`}
              controls
              playsInline
              preload="metadata"
            >
              <source
                src={`${process.env.PUBLIC_URL}/Videos/form.mp4`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </DemoVideo>
            <Caption>
              Prototype demonstration showing real-time movement analysis and
              AI-assisted form feedback on dedicated hardware.
            </Caption>
          </VideoWrap>
        </Fade>
      )}
    </Section>
  );
}

export default FormCorrection;
