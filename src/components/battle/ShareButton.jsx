import styled from 'styled-components';
import { motion } from 'framer-motion';

const ShareButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
`;

export default ShareButton;