import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import Logo from '../../assets/images/logo.png';

const HeroSection = styled.section`
  background: linear-gradient(180deg, #F6F8FB 0%, #EAF1F6 100%);
  padding: 130px 1.5rem 80px;
  scroll-margin-top: 72px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoBlock = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
`;

const LogoImg = styled.img`
  width: 68px;
  height: 68px;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  background: #fff;
  padding: 6px;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 1.25rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.15;
  max-width: 900px;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  color: ${({ theme }) => theme.colors.text};
  max-width: 740px;
  margin: 0 auto 2rem;
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
`;

const HighlightBadge = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const CTARow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
`;

const buttonBase = `
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  transition: all 0.2s ease;
`;

const PrimaryCTA = styled(ScrollLink)`
  ${buttonBase}
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }
`;

const SecondaryCTA = styled(ScrollLink)`
  ${buttonBase}
  background-color: #fff;
  color: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.border};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

function Hero() {
  return (
    <HeroSection id="home">
      <Inner>
        <LogoBlock
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LogoImg src={Logo} alt="BeBTR logo" />
        </LogoBlock>

        <Eyebrow>Dubai Foresight Awards · Foresight for People</Eyebrow>

        <Title>BeBTR: Preventive Fitness Futures</Title>
        <Subtitle>
          AI-assisted posture correction and wearable-driven feedback for safer,
          more preventive fitness environments.
        </Subtitle>

        <Badges>
          <HighlightBadge>Foresight for People</HighlightBadge>
          <Badge>Smart Health Hackathon — 1st Place</Badge>
          <Badge>Department of Health Category</Badge>
          <Badge>Abu Dhabi, UAE</Badge>
        </Badges>

        <CTARow>
          <PrimaryCTA to="demo" smooth duration={500} offset={-72}>
            Watch Demo
          </PrimaryCTA>
          <SecondaryCTA to="impact" smooth duration={500} offset={-72}>
            View Impact Evidence
          </SecondaryCTA>
        </CTARow>
      </Inner>
    </HeroSection>
  );
}

export default Hero;
