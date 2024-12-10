import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  position: relative;
`;

const TeamTitle = styled.h2`
  font-size: 3rem;
  color: ${props => props.side === 'left' ? props.theme.colors.primary : props.theme.colors.secondary};
  text-shadow: 0 0 20px ${props => 
    props.side === 'left' ? 'rgba(255, 51, 102, 0.5)' : 'rgba(0, 245, 255, 0.5)'
  };
  text-align: ${props => props.side === 'left' ? 'left' : 'right'};
  flex: 1;
`;

const VsText = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin: 0 2rem;
  text-shadow: ${props => props.theme.shadows.neon};
  position: relative;
  z-index: 2;
`;

const BattleHeader = () => {
  return (
    <HeaderContainer>
      <TeamTitle side="left">PEPE</TeamTitle>
      <VsText>VS</VsText>
      <TeamTitle side="right">DOGE</TeamTitle>
    </HeaderContainer>
  );
};

export default BattleHeader;