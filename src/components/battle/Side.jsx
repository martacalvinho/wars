import styled from 'styled-components';
import { motion } from 'framer-motion';
import AddMemeButton from '../memes/AddMemeButton';

const Side = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${props => props.side === 'left' ? 
    'linear-gradient(135deg, #FF336620 0%, transparent 100%)' : 
    'linear-gradient(135deg, transparent 0%, #00F5FF20 100%)'
  };
  padding: 1rem;
  overflow: hidden;
`;

const SideWrapper = ({ side, battleId, children }) => (
  <Side side={side}>
    <AddMemeButton side={side} battleId={battleId} />
    {children}
  </Side>
);

export default SideWrapper;