import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import ConnectWallet from './wallet/ConnectWallet';

const Nav = styled.nav`
  background: rgba(26, 27, 58, 0.95);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  text-shadow: ${props => props.theme.shadows.neon};
  text-decoration: none;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  transition: ${props => props.theme.animations.transition};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.primary};
    text-shadow: ${props => props.theme.shadows.neon};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 51, 102, 0.1);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.text};
  text-decoration: none;

  &:hover {
    background: rgba(255, 51, 102, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const Navigation = () => {
  const { user } = useUser();

  return (
    <Nav>
      <NavContainer>
        <LeftSection>
          <Logo to="/">MEME WARS</Logo>
          <NavLink to="/battle">Battle</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </LeftSection>
        
        <RightSection>
          <ConnectWallet />
          <ProfileLink to={user?.username ? `/profile/${user.username}` : '/profile'}>
            {user?.username || 'Profile'}
          </ProfileLink>
        </RightSection>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;