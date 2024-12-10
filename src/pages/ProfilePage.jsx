import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsSection from '../components/profile/StatsSection';
import ActivitySection from '../components/profile/ActivitySection';
import EditProfileModal from '../components/profile/EditProfileModal';

const Container = styled.div`
  padding: 2rem;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const profile = user.username === username ? user : {
    username: username || 'Anonymous',
    team: 'none',
    joinedAt: new Date().toISOString(),
    stats: {
      memes: 0,
      votes: 0,
      likes: 0,
      comments: 0
    }
  };

  const isOwnProfile = user.username === profile.username;

  return (
    <Container>
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing(true)}
      />
      <StatsSection stats={profile.stats} />
      <ActivitySection activity={[]} />
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
      />
    </Container>
  );
};

export default ProfilePage;