import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: rgba(26, 27, 58, 0.4);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const MemeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MemeInfo = styled.div`
  padding: 1rem;
  background: rgba(26, 27, 58, 0.9);
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Votes = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
`;

const Team = styled.div`
  font-size: 0.8rem;
  color: ${props => 
    props.$team === 'pepe' ? props.theme.colors.primary : props.theme.colors.secondary};
`;

const BattleDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Rank = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.heading};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  backdrop-filter: blur(4px);
`;

const TopMemeCard = ({ meme, rank }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <Rank>#{rank + 1}</Rank>
      <MemeImage src={meme.image} alt="Top Meme" />
      <MemeInfo>
        <Stats>
          <Votes>{meme.votes} votes</Votes>
          <Team $team={meme.team}>
            {meme.team === 'pepe' ? 'PEPE ARMY' : 'DOGE SQUAD'}
          </Team>
        </Stats>
        <BattleDate>
          Battle ended {new Date(meme.battleDate).toLocaleDateString()}
        </BattleDate>
      </MemeInfo>
    </Card>
  );
};

export default TopMemeCard;