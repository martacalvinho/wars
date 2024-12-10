import styled from 'styled-components';
import { motion } from 'framer-motion';

const Header = styled(motion.div)`
  background: rgba(26, 27, 58, 0.8);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.gradients.neon};
  }
`;

const Username = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-shadow: ${props => props.theme.shadows.neon};
`;

const JoinDate = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const EditButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.body};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 51, 102, 0.1);
  }
`;

const ProfileHeader = ({ profile, isOwnProfile, onEdit }) => {
  return (
    <Header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Username>{profile.username}</Username>
      <JoinDate>
        Joined {new Date(profile.joinedAt).toLocaleDateString()}
      </JoinDate>
      
      {isOwnProfile && (
        <EditButton
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </EditButton>
      )}
    </Header>
  );
};

export default ProfileHeader;