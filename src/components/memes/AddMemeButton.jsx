import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const HiddenInput = styled.input`
  display: none;
`;

const AddMemeButton = ({ side }) => {
  const [inputKey, setInputKey] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload here
      console.log('File selected:', file);
    }
    // Reset input to allow selecting the same file again
    setInputKey(prev => prev + 1);
  };

  return (
    <>
      <Button
        side={side}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById(`fileInput-${side}`).click()}
      >
        <svg viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Add Meme
      </Button>
      <HiddenInput
        key={inputKey}
        id={`fileInput-${side}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
};

export default AddMemeButton;