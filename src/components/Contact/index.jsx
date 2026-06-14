import React from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaGlobe, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Section from '../Section';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Eyebrow = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.5rem;
`;

const Name = styled.h3`
  font-size: 1.35rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.35rem;
`;

const Role = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
`;

const CreditNote = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  padding: 0.85rem 1rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  border-radius: 6px;
`;

const LinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const LinkItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    word-break: break-all;
  }
`;

const LinkIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

function Contact() {
  return (
    <Section id="credit" eyebrow="Credit" title="Project Credit" alt>
      <Grid>
        <Card>
          <Eyebrow>Main contact & 2026 foresight lead</Eyebrow>
          <Name>Awaiz Ahmed</Name>
          <Role>
            Software Engineer · AI/ML & MLOps · Al Ain University · 42 Abu Dhabi
          </Role>

          <CreditNote>
            Originally developed as a Smart Health Hackathon team project; 2026
            foresight refinement and award submission led by Awaiz Ahmed.
          </CreditNote>

          <LinkList>
            <LinkItem>
              <LinkIcon>
                <FaEnvelope />
              </LinkIcon>
              <a href="mailto:awaiz42ad@gmail.com">awaiz42ad@gmail.com</a>
            </LinkItem>
            <LinkItem>
              <LinkIcon>
                <FaGlobe />
              </LinkIcon>
              <a
                href="https://awaizahmed.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                awaizahmed.com
              </a>
            </LinkItem>
            <LinkItem>
              <LinkIcon>
                <FaGithub />
              </LinkIcon>
              <a
                href="https://github.com/4waiz"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/4waiz
              </a>
            </LinkItem>
            <LinkItem>
              <LinkIcon>
                <FaLinkedinIn />
              </LinkIcon>
              <a
                href="https://www.linkedin.com/in/awaiz-ahmed"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/awaiz-ahmed
              </a>
            </LinkItem>
          </LinkList>
        </Card>

        <Card>
          <Eyebrow>Submission</Eyebrow>
          <Name>Dubai Foresight Awards</Name>
          <Role>Category: Foresight for People</Role>

          <p style={{ color: 'inherit', fontSize: '0.98rem' }}>
            This site serves as the project evidence page for BeBTR: Preventive
            Fitness Futures. It documents recognition, prototype evidence,
            architecture, foresight method, and the 10-year impact vision in a
            form suitable for judges to verify the initiative.
          </p>
        </Card>
      </Grid>
    </Section>
  );
}

export default Contact;
