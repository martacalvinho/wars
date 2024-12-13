import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SubmitMemeModal from './SubmitMemeModal';

const Button = styled(motion.button)`
  background: ${props => 
    props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: auto;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const AddMemeButton = ({ side, battleId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        side={side}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 4V20M20 12H4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Meme
      </Button>

      <SubmitMemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        battleId={battleId}
        team={side}
      />
    </>
  );
};

export default AddMemeButton;