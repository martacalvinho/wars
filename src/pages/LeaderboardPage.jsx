import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../lib/supabase';

const Container = styled.div`
  padding: 2rem;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.primary};
  text-shadow: ${props => props.theme.shadows.neon};
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: ${props => props.theme.colors.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border}40;
`;

const RankCell = styled(TableCell)`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.text};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.text};
`;

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await getLeaderboard(20); // Get top 20 users
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading leaderboard...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>Error loading leaderboard: {error}</EmptyState>
      </Container>
    );
  }

  if (!leaderboard.length) {
    return (
      <Container>
        <EmptyState>No users found. Be the first to submit a meme!</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Leaderboard</Title>

      <LeaderboardTable>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Total Votes</TableHeader>
            <TableHeader>Memes</TableHeader>
            <TableHeader>Wins</TableHeader>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <TableRow key={user.id}>
              <RankCell>{index + 1}</RankCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.total_votes_received || 0}</TableCell>
              <TableCell>{user.total_memes_submitted || 0}</TableCell>
              <TableCell>{user.total_wins || 0}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </LeaderboardTable>
    </Container>
  );
};

export default LeaderboardPage;