import React from 'react';
import styled from 'styled-components';
import Reveal from '../Reveal';

const SectionEl = styled.section`
  padding: 5rem 1.5rem;
  scroll-margin-top: 72px;
  background-color: ${({ $alt, theme }) =>
    $alt ? theme.colors.surface : theme.colors.light};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.6rem;
`;

const Title = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.75rem;
  line-height: 1.25;
`;

const Lede = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  max-width: 760px;
  margin-bottom: 2.5rem;
`;

const HeaderRow = styled.div`
  margin-bottom: 2.5rem;
`;

function Section({ id, eyebrow, title, lede, alt = false, children }) {
  return (
    <SectionEl id={id} $alt={alt}>
      <Container>
        {(eyebrow || title || lede) && (
          <Reveal as={HeaderRow}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <Title>{title}</Title>}
            {lede && <Lede>{lede}</Lede>}
          </Reveal>
        )}
        <Reveal delay={0.08}>{children}</Reveal>
      </Container>
    </SectionEl>
  );
}

export default Section;
