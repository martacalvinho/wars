import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

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

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  text-shadow: ${props => props.theme.shadows.neon};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
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

const ProfileButton = styled(motion(Link))`
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
        <Logo to="/">MEME WARS</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/battle/active">Battle</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <ProfileButton
            to={user.username ? `/profile/${user.username}` : '/profile'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {user.username || 'Profile'}
          </ProfileButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;