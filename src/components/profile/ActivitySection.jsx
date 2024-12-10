import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  text-shadow: ${props => props.theme.shadows.neon};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 27, 58, 0.4);
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`;

const ActivityCard = styled(motion.div)`
  background: rgba(26, 27, 58, 0.4);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.colors.primary}20;
    border-radius: 50%;
    color: ${props => props.theme.colors.primary};
  }

  .content {
    flex: 1;

    p {
      margin: 0;
      color: ${props => props.theme.colors.text};
    }

    .timestamp {
      font-size: 0.8rem;
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  background: rgba(26, 27, 58, 0.4);
  border-radius: 10px;
  font-family: ${props => props.theme.fonts.heading};
`;

const ActivitySection = ({ activity = [] }) => {
  return (
    <Container>
      <Title>RECENT ACTIVITY</Title>
      {activity.length > 0 ? (
        <ActivityList>
          {activity.map((item, index) => (
            <ActivityCard
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="icon">
                {item.type === 'meme' ? '🖼️' : 
                 item.type === 'vote' ? '🗳️' : 
                 item.type === 'comment' ? '💬' : '⭐'}
              </div>
              <div className="content">
                <p>{item.description}</p>
                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </ActivityCard>
          ))}
        </ActivityList>
      ) : (
        <EmptyState>No activity yet</EmptyState>
      )}
    </Container>
  );
};

export default ActivitySection;