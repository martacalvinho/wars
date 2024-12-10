import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  position: ${props => props.$minimized ? 'fixed' : 'absolute'};
  top: ${props => props.$minimized ? '60px' : '50%'};
  left: ${props => props.$minimized ? '0' : '50%'};
  right: ${props => props.$minimized ? '0' : 'auto'};
  transform: ${props => props.$minimized ? 'none' : 'translate(-50%, -50%)'};
  z-index: 3;
  background: rgba(26, 27, 58, 0.95);
  padding: ${props => props.$minimized ? '0.5rem 2rem' : '1.5rem'};
  border-radius: ${props => props.$minimized ? '0' : '15px'};
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  min-width: ${props => props.$minimized ? '100%' : '300px'};
`;

const Content = styled.div`
  display: flex;
  flex-direction: ${props => props.$minimized ? 'row' : 'column'};
  align-items: center;
  gap: ${props => props.$minimized ? '2rem' : '1rem'};
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  letter-spacing: 2px;
`;

const BattleStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

const VoteCount = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1rem;
  color: ${props => props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
  ${props => props.$minimized ? `
    order: ${props.side === 'left' ? 0 : 2};
    min-width: 100px;
  ` : ''}
`;

const ProgressContainer = styled.div`
  position: relative;
  flex: 1;
  height: 30px;
  display: ${props => props.$minimized ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ProgressBar = styled(motion.div)`
  width: 20px;
  height: 100%;
  background: ${props => props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    filter: brightness(1.2);
  }
`;

const Percentage = styled.div`
  position: absolute;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 0.8rem;
  color: ${props => props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
`;

const VoteButtons = styled.div`
  display: ${props => props.$minimized ? 'none' : 'flex'};
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

const VoteButton = styled(motion.button)`
  flex: 1;
  background: ${props => props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 2px;

  &:hover {
    filter: brightness(1.2);
  }
`;

const MinimizeButton = styled(motion.button)`
  position: absolute;
  top: ${props => props.$minimized ? '50%' : '0.5rem'};
  right: ${props => props.$minimized ? '1rem' : '0.5rem'};
  transform: ${props => props.$minimized ? 'translateY(-50%)' : 'none'};
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  z-index: 2;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const VoteMeter = ({ votes, onVote }) => {
  const [minimized, setMinimized] = useState(false);
  const totalVotes = votes.left + votes.right;
  const leftPercentage = (votes.left / totalVotes) * 100;
  const rightPercentage = (votes.right / totalVotes) * 100;

  return (
    <Container
      $minimized={minimized}
      initial={false}
      animate={{
        y: minimized ? 0 : '-50%',
        x: minimized ? 0 : '-50%',
        height: minimized ? 'auto' : 'auto'
      }}
    >
      {!minimized && <Title>BATTLE PROGRESS</Title>}
      <Content $minimized={minimized}>
        <BattleStats>
          <VoteCount side="left" $minimized={minimized}>
            {votes.left} votes
          </VoteCount>
          
          <ProgressContainer $minimized={minimized}>
            <ProgressBar
              side="left"
              onClick={() => onVote('left')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
            <Percentage side="left" $minimized={minimized}>
              {Math.round(leftPercentage)}%
            </Percentage>
            <Percentage side="right" $minimized={minimized}>
              {Math.round(rightPercentage)}%
            </Percentage>
            <ProgressBar
              side="right"
              onClick={() => onVote('right')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          </ProgressContainer>

          <VoteCount side="right" $minimized={minimized}>
            {votes.right} votes
          </VoteCount>
        </BattleStats>

        <VoteButtons $minimized={minimized}>
          <VoteButton
            side="left"
            onClick={() => onVote('left')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VOTE
          </VoteButton>
          <VoteButton
            side="right"
            onClick={() => onVote('right')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VOTE
          </VoteButton>
        </VoteButtons>
      </Content>

      <MinimizeButton
        $minimized={minimized}
        onClick={() => setMinimized(!minimized)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {minimized ? '🔽' : '🔼'}
      </MinimizeButton>
    </Container>
  );
};

export default VoteMeter;