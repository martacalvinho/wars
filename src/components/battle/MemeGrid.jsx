import styled from 'styled-components';

const MemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
  height: calc(100vh - 300px);
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

export default MemeGrid;