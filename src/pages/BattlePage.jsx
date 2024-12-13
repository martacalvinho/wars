import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Battle from '../components/battle/Battle';
import CommentSection from '../components/comments/CommentSection';
import { getActiveBattle, getVoteStatus, castVote, getComments, addComment, subscribeToVotes, subscribeToComments } from '../lib/supabase';

const Container = styled.div`
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 0 2rem;
`;

const MessageContainer = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const MessageTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const MessageText = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

export default function BattlePage() {
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useUser();
  const { id } = useParams();

  // Fetch battle data
  useEffect(() => {
    async function fetchBattle() {
      try {
        setLoading(true);
        const battleData = await getActiveBattle();
        setBattle(battleData);

        if (battleData && user) {
          const voteData = await getVoteStatus(battleData.id, user.id);
          setUserVote(voteData?.team || null);
        }

        if (battleData) {
          const commentsData = await getComments(battleData.id);
          setComments(commentsData || []);
        }
      } catch (err) {
        console.error('Error fetching battle:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBattle();
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!battle?.id) return;

    const voteSubscription = subscribeToVotes(battle.id, (payload) => {
      setBattle(prev => ({
        ...prev,
        votes: payload.new.votes
      }));
    });

    const commentSubscription = subscribeToComments(battle.id, (payload) => {
      setComments(prev => [...prev, payload.new]);
    });

    return () => {
      voteSubscription?.unsubscribe();
      commentSubscription?.unsubscribe();
    };
  }, [battle?.id]);

  const handleVote = async (team) => {
    if (!user) return;
    try {
      await castVote({
        battle_id: battle.id,
        user_id: user.id,
        team
      });
      setUserVote(team);
    } catch (err) {
      console.error('Error casting vote:', err);
    }
  };

  const handleComment = async (content) => {
    if (!user || !battle) return;
    try {
      await addComment({
        battle_id: battle.id,
        user_id: user.id,
        content
      });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <MessageContainer>
          <MessageTitle>Loading...</MessageTitle>
        </MessageContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MessageContainer>
          <MessageTitle>Error</MessageTitle>
          <MessageText>{error}</MessageText>
        </MessageContainer>
      </Container>
    );
  }

  if (!battle) {
    return (
      <Container>
        <MessageContainer>
          <MessageTitle>No Active Battle</MessageTitle>
          <MessageText>Check back later for the next meme battle!</MessageText>
        </MessageContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Battle 
        battle={battle}
        onVote={handleVote}
        userVote={userVote}
      />
      <CommentSection
        comments={comments}
        onComment={handleComment}
      />
    </Container>
  );
}