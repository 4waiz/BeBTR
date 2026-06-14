import React from 'react';
import styled from 'styled-components';
import Logo from '../../assets/images/logo.png';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #E2E8F0;
  padding: 3rem 1.5rem 2rem;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const BrandLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  padding: 3px;
`;

const BrandText = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
`;

const Tagline = styled.p`
  max-width: 720px;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const Meta = styled.p`
  font-size: 0.82rem;
  opacity: 0.65;
  margin-top: 0.75rem;
`;

function Footer() {
  return (
    <FooterContainer>
      <Inner>
        <Brand>
          <BrandLogo src={Logo} alt="BeBTR logo" />
          <BrandText>BeBTR</BrandText>
        </Brand>
        <Tagline>
          BeBTR: Preventive Fitness Futures — AI-assisted movement feedback for
          safer, more preventive fitness environments.
        </Tagline>
        <Meta>
          &copy; {new Date().getFullYear()} BeBTR · Dubai Foresight Awards
          submission · Foresight for People
        </Meta>
      </Inner>
    </FooterContainer>
  );
}

export default Footer;
