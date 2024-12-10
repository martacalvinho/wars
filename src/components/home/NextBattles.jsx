import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  background: rgba(26, 27, 58, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
`;

const BattlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BattleCard = styled(motion(Link))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BattleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BattleName = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin: 0;
`;

const BattleDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const CountdownTimer = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
  min-width: 120px;
  text-align: right;
`;

const formatTimeLeft = (timeLeft) => {
  if (timeLeft <= 0) return 'Starting soon';
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

const NextBattles = () => {
  const [battles, setBattles] = useState([
    {
      id: 1,
      name: "Meme Lords vs Dank Masters",
      description: "The ultimate showdown of creativity and humor",
      startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    },
    {
      id: 2,
      name: "Pixel Warriors vs Crypto Artists",
      description: "Where digital art meets blockchain technology",
      startTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    },
    {
      id: 3,
      name: "NFT Legends vs Web3 Wizards",
      description: "The battle of the digital realms",
      startTime: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
    }
  ]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newTimeLeft = {};
      
      battles.forEach(battle => {
        const diff = Math.floor((new Date(battle.startTime) - now) / 1000);
        newTimeLeft[battle.id] = diff > 0 ? diff : 0;
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [battles]);

  return (
    <Container>
      <Title>Next Battles</Title>
      <BattlesList>
        {battles.map(battle => (
          <BattleCard
            key={battle.id}
            to={`/battle/${battle.id}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BattleInfo>
              <BattleName>{battle.name}</BattleName>
              <BattleDescription>{battle.description}</BattleDescription>
            </BattleInfo>
            <CountdownTimer>
              {formatTimeLeft(timeLeft[battle.id])}
            </CountdownTimer>
          </BattleCard>
        ))}
      </BattlesList>
    </Container>
  );
};

export default NextBattles;
