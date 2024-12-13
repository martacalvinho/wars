import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { getUserProfile, updateUsername } from '../lib/supabase';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsSection from '../components/profile/StatsSection';
import ActivitySection from '../components/profile/ActivitySection';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: ${props => props.theme.colors.text};
`;

const ErrorContainer = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.error};
  padding: 2rem;
`;

const UsernameSection = styled.div`
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const EditButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  width: 200px;
  background: #ffffff;
  color: #000000;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary || '#0066cc'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

export default function ProfilePage() {
  const { username: urlUsername } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        
        // If we have a logged-in user, load their profile
        if (user?.wallet_address) {
          const profile = await getUserProfile(user.wallet_address);
          if (profile) {
            setProfileData(profile);
            setNewUsername(profile.username);
            return;
          }
        }

        setError('Please connect your wallet to view your profile');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleUsernameUpdate = async () => {
    try {
      if (!user?.wallet_address) {
        setUsernameError('You must be logged in to update your username');
        return;
      }

      if (!newUsername.trim()) {
        setUsernameError('Username cannot be empty');
        return;
      }

      setUsernameError('');
      console.log('Starting username update to:', newUsername);
      
      const updatedUser = await updateUsername(user.id, newUsername, user.wallet_address);
      console.log('Username update successful:', updatedUser);
      
      if (updatedUser) {
        setProfileData(updatedUser);
        setIsEditingUsername(false);
      } else {
        setUsernameError('Failed to update username');
      }
    } catch (error) {
      console.error('Error in handleUsernameUpdate:', error);
      setUsernameError(error.message || 'Failed to update username');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading profile...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>{error}</ErrorContainer>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container>
        <ErrorContainer>Profile not found</ErrorContainer>
      </Container>
    );
  }

  const isOwnProfile = user && user.id === profileData.id;

  return (
    <Container>
      <ProfileHeader profile={profileData} />
      
      {isOwnProfile && (
        <UsernameSection>
          {isEditingUsername ? (
            <>
              <Input
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setUsernameError('');
                }}
                placeholder="New username"
                minLength={3}
                maxLength={30}
              />
              <ButtonGroup>
                <EditButton onClick={handleUsernameUpdate}>Save</EditButton>
                <EditButton
                  onClick={() => {
                    setIsEditingUsername(false);
                    setUsernameError('');
                  }}
                  style={{ background: props => props.theme.colors.error }}
                >
                  Cancel
                </EditButton>
              </ButtonGroup>
              {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
            </>
          ) : (
            <EditButton
              onClick={() => {
                setNewUsername(profileData.username);
                setIsEditingUsername(true);
              }}
            >
              Edit Username
            </EditButton>
          )}
        </UsernameSection>
      )}

      <StatsSection 
        stats={{
          memes: profileData.total_memes_submitted || 0,
          votes: profileData.total_votes_received || 0,
          likes: profileData.total_votes_cast || 0,
          comments: 0 // Add this when we implement comments
        }} 
      />
      
      <ActivitySection activity={[]} /> {/* We'll implement this later */}
    </Container>
  );
}