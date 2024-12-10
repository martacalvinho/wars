import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CommentContainer = styled(motion.div)`
  background: rgba(26, 27, 58, 0.6);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => 
    props.$team === 'pepe' ? props.theme.colors.primary :
    props.$team === 'doge' ? props.theme.colors.secondary :
    'transparent'
  };
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Author = styled(Link)`
  color: ${props => 
    props.$team === 'pepe' ? props.theme.colors.primary :
    props.$team === 'doge' ? props.theme.colors.secondary :
    props.theme.colors.text
  };
  font-weight: bold;
  text-decoration: none;
  text-shadow: 0 0 10px ${props => 
    props.$team === 'pepe' ? props.theme.colors.primary + '40' :
    props.$team === 'doge' ? props.theme.colors.secondary + '40' :
    'transparent'
  };

  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 1rem;
`;

const CommentText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

const Comment = ({ comment }) => {
  return (
    <CommentContainer
      $team={comment.team}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CommentHeader>
        <Author 
          to={`/profile/${comment.username}`} 
          $team={comment.team}
        >
          {comment.username}
        </Author>
        <Timestamp>{new Date(comment.timestamp).toLocaleString()}</Timestamp>
      </CommentHeader>
      <CommentText>{comment.text}</CommentText>
    </CommentContainer>
  );
};

export default Comment;