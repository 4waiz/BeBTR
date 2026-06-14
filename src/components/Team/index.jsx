import React from 'react';
import styled from 'styled-components';
import {
  FaUser,
  FaVideo,
  FaBrain,
  FaHeartbeat,
  FaCogs,
  FaCommentDots,
  FaSyncAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import Section from '../Section';

const FlowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.85rem;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const StepIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const StepLabel = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.3;
`;

const StepIndex = styled.span`
  position: absolute;
  top: 0.65rem;
  right: 0.85rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
`;

const Explanation = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  max-width: 820px;
`;

const steps = [
  { icon: <FaUser />, label: 'User performs exercise' },
  { icon: <FaVideo />, label: 'Camera / smartphone input' },
  { icon: <FaBrain />, label: 'Pose estimation / computer vision' },
  { icon: <FaHeartbeat />, label: 'Wearable data input' },
  { icon: <FaCogs />, label: 'Movement analysis engine' },
  { icon: <FaCommentDots />, label: 'Posture feedback' },
  { icon: <FaSyncAlt />, label: 'Adaptive training recommendation' },
  { icon: <FaShieldAlt />, label: 'Safer exercise habit formation' },
];

function Team() {
  return (
    <Section
      id="architecture"
      eyebrow="System"
      title="System Architecture"
      alt
    >
      <FlowGrid>
        {steps.map((s, i) => (
          <Step key={s.label}>
            <StepIndex>0{i + 1}</StepIndex>
            <StepIcon>{s.icon}</StepIcon>
            <StepLabel>{s.label}</StepLabel>
          </Step>
        ))}
      </FlowGrid>

      <Explanation>
        BeBTR combines visual movement analysis and wearable signals to provide
        real-time corrective feedback. The architecture is designed to support
        future gyms, schools, workplace wellness programmes, and
        rehabilitation-adjacent fitness settings.
      </Explanation>
    </Section>
  );
}

export default Team;
