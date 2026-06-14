import React from 'react';
import styled from 'styled-components';
import Section from '../Section';

const VideoWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-width: 900px;
  margin: 0 auto;
`;

const DemoVideo = styled.video`
  width: 100%;
  border-radius: 8px;
  display: block;
  background-color: #000;
`;

const Caption = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
  text-align: center;
  font-style: italic;
`;

function FormCorrection() {
  return (
    <Section id="demo" eyebrow="Demo" title="Demo Video">
      <VideoWrap>
        <DemoVideo
          src={`${process.env.PUBLIC_URL}/Videos/form.mp4`}
          controls
          playsInline
          preload="metadata"
        >
          <source
            src={`${process.env.PUBLIC_URL}/Videos/form.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </DemoVideo>
        <Caption>
          Prototype demonstration showing real-time movement analysis and
          AI-assisted form feedback.
        </Caption>
      </VideoWrap>
    </Section>
  );
}

export default FormCorrection;
