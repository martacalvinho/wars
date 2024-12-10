import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 11, 30, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: rgba(26, 27, 58, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  position: relative;
  backdrop-filter: blur(10px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 27, 58, 0.4);
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 51, 102, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-family: ${props => props.theme.fonts.heading};
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SubmitMemeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    memeName: '',
    telegram: '',
    discord: '',
    twitter: '',
    walletAddress: '',
    logo: null
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>
            <Title>Submit Your Meme</Title>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="memeName"
                placeholder="Meme Name"
                value={formData.memeName}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="telegram"
                placeholder="Telegram"
                value={formData.telegram}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="discord"
                placeholder="Discord"
                value={formData.discord}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="twitter"
                placeholder="Twitter"
                value={formData.twitter}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="walletAddress"
                placeholder="Wallet Address"
                value={formData.walletAddress}
                onChange={handleInputChange}
                required
              />
              <HiddenInput
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <UploadArea onClick={() => document.getElementById('logo-upload').click()}>
                <p style={{ fontFamily: props => props.theme.fonts.heading }}>
                  {formData.logo ? formData.logo.name : 'Click to upload image'}
                </p>
              </UploadArea>
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!formData.memeName || !formData.walletAddress || !formData.logo}
              >
                Submit
              </SubmitButton>
            </Form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default SubmitMemeModal;