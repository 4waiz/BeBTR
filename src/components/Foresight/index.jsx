import React from 'react';
import styled from 'styled-components';
import Section from '../Section';

const Intro = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  margin-bottom: 2rem;
  max-width: 820px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CardEyebrow = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.85rem;
`;

const SignalList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Signal = styled.li`
  display: flex;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};

  &:before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accent};
    margin-top: 0.55rem;
    flex-shrink: 0;
  }
`;

const CardBody = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.98rem;
`;

const signals = [
  'Rising demand for preventive health and wellness systems',
  'Wider adoption of wearable devices and real-time biometric feedback',
  'Growth of AI-assisted coaching and computer vision in consumer health',
  'Limited access to affordable personal training and movement correction',
  'Future need for safer fitness environments in gyms, schools, workplaces, and rehabilitation settings',
];

function Foresight() {
  return (
    <Section id="foresight" eyebrow="Method" title="Foresight Method">
      <Intro>
        BeBTR applies foresight by examining how fitness, preventive health,
        and AI-assisted coaching may evolve over the next decade.
      </Intro>

      <Grid>
        <Card>
          <CardEyebrow>Signals of change</CardEyebrow>
          <CardTitle>What we are observing today</CardTitle>
          <SignalList>
            {signals.map((s) => (
              <Signal key={s}>{s}</Signal>
            ))}
          </SignalList>
        </Card>

        <Card>
          <CardEyebrow>Future scenario</CardEyebrow>
          <CardTitle>The 2035 view</CardTitle>
          <CardBody>
            By 2035, gyms, schools, workplaces, and wellness programmes may
            use real-time AI movement feedback as part of everyday preventive
            health.
          </CardBody>
        </Card>

        <Card>
          <CardEyebrow>Backcasting</CardEyebrow>
          <CardTitle>What we are prototyping now</CardTitle>
          <CardBody>
            BeBTR prototypes this future today by combining computer vision,
            wearable signals, and adaptive feedback to support safer exercise
            habits before injuries occur.
          </CardBody>
        </Card>
      </Grid>
    </Section>
  );
}

export default Foresight;
