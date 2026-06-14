import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import About from '../components/About';
import Algorithm from '../components/Algorithm';
import FormCorrection from '../components/FormCorrection';
import HormoneCycle from '../components/HormoneCycle';
import Team from '../components/Team';
import Foresight from '../components/Foresight';
import Impact from '../components/Impact';
import TenYear from '../components/TenYear';
import Contact from '../components/Contact';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  return (
    <HomeContainer>
      <Hero />
      <About />
      <Algorithm />
      <FormCorrection />
      <HormoneCycle />
      <Team />
      <Foresight />
      <Impact />
      <TenYear />
      <Contact />
    </HomeContainer>
  );
}

export default Home;
