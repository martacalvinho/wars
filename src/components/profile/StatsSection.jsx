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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 27, 58, 0.4);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;

  h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.primary};
    text-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
    font-family: ${props => props.theme.fonts.heading};
  }
`;

const StatsSection = ({ stats }) => {
  const statItems = [
    { label: 'Memes Posted', value: stats.memes },
    { label: 'Total Votes', value: stats.votes },
    { label: 'Likes Given', value: stats.likes },
    { label: 'Comments', value: stats.comments }
  ];

  return (
    <Container>
      <Title>STATISTICS</Title>
      <Grid>
        {statItems.map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </StatCard>
        ))}
      </Grid>
    </Container>
  );
};

export default StatsSection;