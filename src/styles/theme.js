import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#FF3366',
    secondary: '#00F5FF',
    background: '#0A0B1E',
    surface: '#1A1B3A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    accent: '#FFD700'
  },
  fonts: {
    heading: "'Press Start 2P', cursive",
    body: "'Inter', sans-serif"
  },
  gradients: {
    neon: 'linear-gradient(135deg, #FF3366 0%, #00F5FF 100%)',
    battle: 'linear-gradient(90deg, #FF3366 0%, #00F5FF 100%)'
  },
  shadows: {
    neon: '0 0 10px rgba(255, 51, 102, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
    hover: '0 8px 16px rgba(0, 0, 0, 0.3)'
  },
  animations: {
    transition: '0.3s ease-in-out'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.body};
    line-height: 1.5;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    font-family: ${props => props.theme.fonts.body};
    transition: ${props => props.theme.animations.transition};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.hover};
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: ${props => props.theme.animations.transition};
  }
`;