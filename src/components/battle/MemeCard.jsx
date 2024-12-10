import styled from 'styled-components';
import { motion } from 'framer-motion';

const MemeCard = styled(motion.div)`
  position: relative;
  background: rgba(26, 27, 58, 0.8);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  padding-top: 100%; /* Makes it square */
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .likes {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;
    padding: 0.5rem;
    border-radius: 20px;
    font-family: ${props => props.theme.fonts.body};
    font-size: 1rem;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);

    svg {
      width: 20px;
      height: 20px;
      fill: ${props => props.$liked ? '#ff3366' : 'white'};
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
      transition: all 0.2s ease;
    }

    &:hover svg {
      transform: scale(1.2);
      fill: #ff3366;
    }
  }
`;

const HeartIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const MemeCardWrapper = ({ children, liked, onClick, onLike, likes, ...props }) => (
  <MemeCard
    $liked={liked}
    onClick={onClick}
    {...props}
  >
    {children}
    <div 
      className="likes"
      onClick={(e) => {
        e.stopPropagation();
        onLike();
      }}
    >
      <HeartIcon />
      {likes}
    </div>
  </MemeCard>
);

export default MemeCardWrapper;