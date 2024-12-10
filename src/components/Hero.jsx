import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';
import SubmitMemeModal from './memes/SubmitMemeModal';

const HeroSection = styled.section`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: ${props => props.theme.gradients.neon};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 11, 30, 0.8);
    z-index: 1;
  }
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme.shadows.neon};
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <HeroSection>
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          MEME WARS
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Where Crypto Communities Battle with Creativity
        </Subtitle>
        <ButtonGroup>
          <Button primary to="/battle/active">
            View Battle
          </Button>
          <Button to="/leaderboard">
            View Leaderboard
          </Button>
        </ButtonGroup>
        <SubmitButtonContainer>
          <Button primary onClick={() => setIsModalOpen(true)}>
            Submit Meme
          </Button>
        </SubmitButtonContainer>
      </Content>
      <SubmitMemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </HeroSection>
  );
};

export default Hero;