import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TeamSelect from './TeamSelect';
import { useUser } from '../../context/UserContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(26, 27, 58, 0.4);
  padding: 1.5rem;
  border-radius: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const UsernameInput = styled.input`
  flex: 1;
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  color: white;
  padding: 0.8rem 1rem;
  font-family: ${props => props.theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  color: white;
  padding: 1rem;
  resize: vertical;
  min-height: 80px;
  font-family: ${props => props.theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
  }
`;

const SubmitButton = styled(motion.button)`
  align-self: flex-end;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-family: ${props => props.theme.fonts.body};
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentForm = ({ onSubmit }) => {
  const { user, updateUser } = useUser();
  const [team, setTeam] = useState(user.team || 'none');
  const [username, setUsername] = useState(user.username || '');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (team === 'none' || !comment.trim() || !username.trim()) return;

    // Update user context if username or team changed
    if (username !== user.username || team !== user.team) {
      updateUser({
        username,
        team,
        joinedAt: user.joinedAt || new Date().toISOString(),
        stats: {
          ...user.stats,
          comments: (user.stats?.comments || 0) + 1
        }
      });
    }

    onSubmit({
      team,
      username,
      text: comment,
      timestamp: new Date().toISOString(),
    });

    setComment('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <UsernameInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          required
        />
        <TeamSelect
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
      </InputGroup>
      <CommentInput
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts..."
        required
      />
      <SubmitButton
        type="submit"
        disabled={team === 'none' || !comment.trim() || !username.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Post Comment
      </SubmitButton>
    </Form>
  );
};

export default CommentForm;