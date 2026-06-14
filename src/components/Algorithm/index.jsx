import React from 'react';
import styled from 'styled-components';
import Section from '../Section';
import CertificateImg from '../../images/certificate.jpeg';
import ChequeTeamImg from '../../images/cheque-team.jpg';
import ChequeSoloImg from '../../images/cheque-solo.jpg';

const Intro = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  margin-bottom: 2rem;
  max-width: 820px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const ProofCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ProofImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  object-position: ${({ position }) => position || 'center'};
  display: block;
`;

const CardBody = styled.div`
  padding: 1.1rem 1.25rem 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ProofTitle = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const ProofNote = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const proofs = [
  {
    img: CertificateImg,
    position: 'center',
    title: 'Certificate of Excellence',
    note: '1st Place — Smart Health Hackathon, Department of Health, Abu Dhabi.',
  },
  {
    img: ChequeTeamImg,
    position: 'center 30%',
    title: 'Startup Zone — Award',
    note: 'Receiving the AED 20,000 prize at the Gym of the Future zone.',
  },
  {
    img: ChequeSoloImg,
    position: 'center 48%',
    title: 'Department of Health Win',
    note: 'AED 20,000 award at Abu Dhabi Global Health Week 2025.',
  },
];

function Algorithm() {
  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="Smart Health Hackathon Recognition"
      alt
    >
      <Intro>
        BeBTR was originally developed for the Smart Health Hackathon and
        achieved 1st Place in the Department of Health category. The project
        was recognised for applying AI, computer vision, and wearable data to
        real-time posture correction and adaptive training.
      </Intro>

      <Grid>
        {proofs.map((p) => (
          <ProofCard key={p.title}>
            <ProofImage src={p.img} alt={p.title} position={p.position} />
            <CardBody>
              <ProofTitle>{p.title}</ProofTitle>
              <ProofNote>{p.note}</ProofNote>
            </CardBody>
          </ProofCard>
        ))}
      </Grid>
    </Section>
  );
}

export default Algorithm;
