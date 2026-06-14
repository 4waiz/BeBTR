import React from 'react';
import styled from 'styled-components';
import Section from '../Section';

const Card = styled.div`
  background: linear-gradient(135deg, #0F2540 0%, #1F8E8E 100%);
  color: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 0.85rem;
`;

const Heading = styled.h3`
  color: #fff;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  margin-bottom: 1rem;
  max-width: 720px;
`;

const Body = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  opacity: 0.95;
  max-width: 820px;
`;

function TenYear() {
  return (
    <Section id="ten-year" eyebrow="Horizon" title="10-Year Impact Vision">
      <Card>
        <Eyebrow>2026 — 2035</Eyebrow>
        <Heading>From generic exercise tracking to preventive, AI-assisted personal health.</Heading>
        <Body>
          Over the next decade, BeBTR aims to support the shift from generic
          exercise tracking to preventive, AI-assisted personal health. Its
          long-term impact is a future where movement feedback becomes more
          accessible, safer, and more personalized across gyms, schools,
          workplaces, rehabilitation-adjacent environments, and community
          wellness programmes.
        </Body>
      </Card>
    </Section>
  );
}

export default TenYear;
