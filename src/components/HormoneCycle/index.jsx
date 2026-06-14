import React from 'react';
import styled from 'styled-components';
import Section from '../Section';
import AppShot from '../../images/App.png';
import CycleShot from '../../images/Cycle.png';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const ShotCard = styled.figure`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const Shot = styled.img`
  width: 100%;
  height: 280px;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.light};
  padding: 0.75rem;
`;

const Caption = styled.figcaption`
  padding: 0.85rem 1rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.muted};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const screenshots = [
  {
    src: AppShot,
    alt: 'BeBTR prototype interface showing form feedback',
    caption:
      'Prototype interface — real-time movement analysis and feedback UI.',
  },
  {
    src: CycleShot,
    alt: 'BeBTR adaptive training visualisation',
    caption:
      'Adaptive training visualisation used during the prototype demo.',
  },
];

function HormoneCycle() {
  return (
    <Section
      id="screenshots"
      eyebrow="Prototype"
      title="Prototype Screenshots"
    >
      <Grid>
        {screenshots.map((s) => (
          <ShotCard key={s.caption}>
            <Shot src={s.src} alt={s.alt} loading="lazy" />
            <Caption>{s.caption}</Caption>
          </ShotCard>
        ))}
      </Grid>
    </Section>
  );
}

export default HormoneCycle;
