import React from 'react';
import styled from 'styled-components';
import Section from '../Section';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 2rem;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

function About() {
  return (
    <Section
      id="about"
      eyebrow="Overview"
      title="A preventive-health foresight initiative"
    >
      <Card>
        BeBTR is a preventive-health foresight initiative exploring how AI,
        computer vision, and wearable data can shift fitness from reactive
        exercise tracking to proactive injury-prevention feedback. The system
        analyses movement in real time, detects posture issues, and provides
        corrective guidance to support safer exercise habits.
      </Card>
    </Section>
  );
}

export default About;
