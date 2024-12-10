import { useState } from 'react';
import styled from 'styled-components';
import CommentForm from './CommentForm';
import Comment from './Comment';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CommentList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 2rem 0;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 27, 58, 0.4);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const NoComments = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
  padding: 2rem 0;
`;

const CommentSection = ({ battleId }) => {
  const [comments, setComments] = useState([]);

  const handleSubmitComment = (newComment) => {
    setComments(prev => [{
      ...newComment,
      battleId,
      id: Date.now()
    }, ...prev]);
  };

  const battleComments = comments.filter(comment => comment.battleId === battleId);

  return (
    <Container>
      <Title>BATTLE CHAT</Title>
      <CommentForm onSubmit={handleSubmitComment} />
      <CommentList>
        {battleComments.length > 0 ? (
          battleComments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <NoComments>Be the first to comment!</NoComments>
        )}
      </CommentList>
    </Container>
  );
};

export default CommentSection;