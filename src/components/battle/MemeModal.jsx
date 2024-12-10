import styled from 'styled-components';
import { motion } from 'framer-motion';
import MemeActions from './MemeActions';
import VoteButton from './VoteButton';
import ShareButton from './ShareButton';

const Modal = styled(motion.div)`
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
  padding: 2rem;
  overflow-y: auto;
`;

const Content = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
  max-width: 800px;
  width: 90%;
  position: relative;
  margin: auto;
  max-height: 90vh;
  overflow-y: auto;
  
  img {
    width: 100%;
    max-height: 50vh;
    object-fit: contain;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 27, 58, 0.4);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const MemeModal = ({ meme, onClose, onVote, upvoted }) => {
  return (
    <Modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Content
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={meme.image} alt="Meme" />
        <MemeActions>
          <VoteButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            upvoted={upvoted}
            onClick={() => onVote(meme)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
            {meme.upvotes}
          </VoteButton>
          <ShareButton>🔗</ShareButton>
        </MemeActions>
      </Content>
    </Modal>
  );
};

export default MemeModal;