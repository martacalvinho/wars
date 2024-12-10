import styled from 'styled-components';
import { motion } from 'framer-motion';
import AddMemeButton from './AddMemeButton';

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const SortButton = styled(motion.button)`
  background: ${props => props.$active ? 'rgba(26, 27, 58, 0.9)' : 'transparent'};
  border: 1px solid ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: ${props => props.theme.fonts.body};
  cursor: pointer;
  margin-left: 1rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MemeSort = ({ sortBy, onSortChange, side }) => {
  return (
    <SortContainer>
      <AddMemeButton side={side} />
      <ButtonGroup>
        <SortButton
          $active={sortBy === 'recent'}
          onClick={() => onSortChange('recent')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Recent
        </SortButton>
        <SortButton
          $active={sortBy === 'popular'}
          onClick={() => onSortChange('popular')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Popular
        </SortButton>
      </ButtonGroup>
    </SortContainer>
  );
};

export default MemeSort;