import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${({ $scrolled }) =>
    $scrolled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.25s ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Brand = styled(ScrollLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  text-decoration: none;
`;

const BrandLogo = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 8px;
`;

const BrandText = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.01em;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.75rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 64px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    width: 100%;
    height: calc(100vh - 64px);
    background-color: ${({ theme }) => theme.colors.surface};
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 2.5rem;
    gap: 1.5rem;
    transition: left 0.3s ease;
  }
`;

const NavLink = styled(ScrollLink)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const navItems = [
  { to: 'home', label: 'Overview' },
  { to: 'recognition', label: 'Recognition' },
  { to: 'demo', label: 'Demo' },
  { to: 'architecture', label: 'Architecture' },
  { to: 'foresight', label: 'Foresight' },
  { to: 'impact', label: 'Impact' },
  { to: 'credit', label: 'Credit' },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <HeaderContainer $scrolled={scrolled}>
      <NavContainer>
        <Brand to="home" smooth duration={500} onClick={close}>
          <BrandLogo src={Logo} alt="BeBTR logo" />
          <BrandText>BeBTR</BrandText>
        </Brand>

        <NavLinks $isOpen={isOpen}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                smooth
                duration={500}
                offset={-72}
                onClick={close}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </NavLinks>

        <MobileMenuButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>
    </HeaderContainer>
  );
}

export default Header;
