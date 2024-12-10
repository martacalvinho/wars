import styled from 'styled-components';
import { motion } from 'framer-motion';

const VoteButton = styled(motion.button)`
  background: ${props => props.upvoted ? props.theme.colors.primary : 'transparent'};
  border: 2px solid ${props => props.theme.colors.primary};
  color: ${props => props.upvoted ? 'white' : props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: ${props => props.theme.fonts.body};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.upvoted ? 'white' : props.theme.colors.text};
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateY(-2px);
  }
`;

export default VoteButton;