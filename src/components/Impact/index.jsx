import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaUsers, FaInfoCircle } from 'react-icons/fa';
import Section from '../Section';

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
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
`;

const IconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Item = styled.li`
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

const Body = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.98rem;
`;

const LimitationCard = styled(Card)`
  border-color: ${({ theme }) => theme.colors.warning};
  background-color: #FFFBEB;
`;

const currentImpact = [
  '1st Place, Smart Health Hackathon, Department of Health category',
  'Functional prototype demonstrating AI-assisted posture correction',
  'Real-time movement analysis using computer vision',
  'Wearable-data concept for adaptive training feedback',
  'Public recognition through media/news coverage',
  'Local early-stage validation in Abu Dhabi/UAE innovation context',
];

function Impact() {
  return (
    <Section id="impact" eyebrow="Evidence" title="Impact Evidence" alt>
      <Grid>
        <Card>
          <CardHeader>
            <IconWrap>
              <FaCheck />
            </IconWrap>
            <CardTitle>Current impact</CardTitle>
          </CardHeader>
          <List>
            {currentImpact.map((i) => (
              <Item key={i}>{i}</Item>
            ))}
          </List>
        </Card>

        <Card>
          <CardHeader>
            <IconWrap>
              <FaUsers />
            </IconWrap>
            <CardTitle>Human value</CardTitle>
          </CardHeader>
          <Body>
            BeBTR supports beginners, students, gym users, trainers, workplace
            wellness participants, and users who may not have access to
            constant one-to-one coaching.
          </Body>
        </Card>

        <LimitationCard>
          <CardHeader>
            <IconWrap>
              <FaInfoCircle />
            </IconWrap>
            <CardTitle>Important limitation</CardTitle>
          </CardHeader>
          <Body>
            BeBTR is currently an award-winning prototype and foresight
            initiative. Larger pilot testing is required before clinical,
            commercial, or institutional deployment claims can be made.
          </Body>
        </LimitationCard>
      </Grid>
    </Section>
  );
}

export default Impact;
