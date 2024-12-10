import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StyledButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  background: ${props => props.$isPrimary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.$isPrimary ? 'transparent' : props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.neon};
  cursor: pointer;
  font-family: ${props => props.theme.fonts.body};
  transition: ${props => props.theme.animations.transition};
`;

const StyledLink = styled(motion(Link))`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  background: ${props => props.$isPrimary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.$isPrimary ? 'transparent' : props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.neon};
  cursor: pointer;
  font-family: ${props => props.theme.fonts.body};
  transition: ${props => props.theme.animations.transition};
  text-decoration: none;
  display: inline-block;
`;

const Button = ({ children, primary, to, ...props }) => {
  const Component = to ? StyledLink : StyledButton;
  return (
    <Component
      $isPrimary={primary}
      to={to}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;