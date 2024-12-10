import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';

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
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  font-family: ${props => props.theme.fonts.heading};
`;

const Input = styled.input`
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-family: ${props => props.theme.fonts.heading};
  cursor: pointer;
  font-size: 1rem;
  border: none;
  
  background: ${props => props.$primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$primary ? 'white' : props.theme.colors.text};
  border: ${props => props.$primary ? 'none' : `1px solid ${props.theme.colors.primary}40`};

  &:hover {
    background: ${props => props.$primary ? props.theme.colors.primary : props.theme.colors.primary + '20'};
  }
`;

const EditProfileModal = ({ isOpen, onClose, profile }) => {
  const { updateUser } = useUser();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      username,
      joinedAt: profile.joinedAt,
      stats: profile.stats
    });
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
            <Title>Edit Profile</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                  placeholder="Enter your username"
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  $primary
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;