import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TopMemeCard from '../components/leaderboard/TopMemeCard';

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

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const TeamCard = styled(motion.div)`
  background: rgba(26, 27, 58, 0.8);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid ${props => 
    props.$team === 'pepe' ? props.theme.colors.primary : props.theme.colors.secondary}40;

  h2 {
    color: ${props => 
      props.$team === 'pepe' ? props.theme.colors.primary : props.theme.colors.secondary};
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px ${props => 
      props.$team === 'pepe' ? props.theme.colors.primary : props.theme.colors.secondary}40;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  h3 {
    font-size: 2rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
    font-family: ${props => props.theme.fonts.heading};
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled(motion.button)`
  background: ${props => props.$active ? 'rgba(26, 27, 58, 0.9)' : 'transparent'};
  border: 1px solid ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-family: ${props => props.theme.fonts.heading};
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LeaderboardGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const TopMemesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin: 3rem 0 2rem;
  text-shadow: ${props => props.theme.shadows.neon};
`;

const LeaderboardItem = styled(motion.div)`
  background: rgba(26, 27, 58, 0.4);
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .rank {
    font-size: 1.5rem;
    font-family: ${props => props.theme.fonts.heading};
    color: ${props => props.theme.colors.primary};
    min-width: 40px;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      object-fit: cover;
    }

    .info {
      h3 {
        margin: 0;
        color: ${props => props.theme.colors.text};
      }

      .team {
        font-size: 0.8rem;
        color: ${props => 
          props.$team === 'pepe' ? props.theme.colors.primary : props.theme.colors.secondary};
      }
    }
  }

  .stats {
    text-align: right;
    
    .value {
      font-size: 1.2rem;
      color: ${props => props.theme.colors.text};
      font-family: ${props => props.theme.fonts.heading};
    }

    .label {
      font-size: 0.8rem;
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('memes');

  const teamStats = {
    pepe: {
      totalMemes: 420,
      totalVotes: 69420,
      avgLikes: 165
    },
    doge: {
      totalMemes: 369,
      totalVotes: 42069,
      avgLikes: 142
    }
  };

  const mockTopMemes = [
    {
      id: 1,
      image: 'https://picsum.photos/400/400?1',
      votes: 9876,
      team: 'pepe',
      battleDate: '2024-01-20'
    },
    {
      id: 2,
      image: 'https://picsum.photos/400/400?2',
      votes: 8765,
      team: 'doge',
      battleDate: '2024-01-19'
    },
    {
      id: 3,
      image: 'https://picsum.photos/400/400?3',
      votes: 7654,
      team: 'pepe',
      battleDate: '2024-01-18'
    },
    {
      id: 4,
      image: 'https://picsum.photos/400/400?4',
      votes: 6543,
      team: 'doge',
      battleDate: '2024-01-17'
    },
    {
      id: 5,
      image: 'https://picsum.photos/400/400?5',
      votes: 5432,
      team: 'pepe',
      battleDate: '2024-01-16'
    },
    {
      id: 6,
      image: 'https://picsum.photos/400/400?6',
      votes: 4321,
      team: 'doge',
      battleDate: '2024-01-15'
    }
  ];

  const mockData = {
    memes: [
      { id: 1, user: 'PepeKing', team: 'pepe', value: 1337, image: 'https://picsum.photos/50/50?1' },
      { id: 2, user: 'DogeQueen', team: 'doge', value: 1234, image: 'https://picsum.photos/50/50?2' },
      { id: 3, user: 'MemeGod', team: 'pepe', value: 999, image: 'https://picsum.photos/50/50?3' },
      { id: 4, user: 'CryptoArtist', team: 'doge', value: 888, image: 'https://picsum.photos/50/50?4' },
      { id: 5, user: 'PepeLord', team: 'pepe', value: 777, image: 'https://picsum.photos/50/50?5' },
    ],
    votes: [
      { id: 1, user: 'VoteChad', team: 'doge', value: 5432, image: 'https://picsum.photos/50/50?6' },
      { id: 2, user: 'PepeVoter', team: 'pepe', value: 4321, image: 'https://picsum.photos/50/50?7' },
      { id: 3, user: 'DogeSupporter', team: 'doge', value: 3333, image: 'https://picsum.photos/50/50?8' },
      { id: 4, user: 'CryptoVoter', team: 'pepe', value: 2222, image: 'https://picsum.photos/50/50?9' },
      { id: 5, user: 'MemeVoter', team: 'doge', value: 1111, image: 'https://picsum.photos/50/50?10' },
    ],
    likes: [
      { id: 1, user: 'LikeKing', team: 'pepe', value: 9999, image: 'https://picsum.photos/50/50?11' },
      { id: 2, user: 'DogeLiker', team: 'doge', value: 8888, image: 'https://picsum.photos/50/50?12' },
      { id: 3, user: 'PepeFan', team: 'pepe', value: 7777, image: 'https://picsum.photos/50/50?13' },
      { id: 4, user: 'MemeEnjoyer', team: 'doge', value: 6666, image: 'https://picsum.photos/50/50?14' },
      { id: 5, user: 'CryptoLiker', team: 'pepe', value: 5555, image: 'https://picsum.photos/50/50?15' },
    ]
  };

  const getLabel = (tab) => {
    switch (tab) {
      case 'memes': return 'Memes';
      case 'votes': return 'Votes';
      case 'likes': return 'Likes';
      default: return '';
    }
  };

  return (
    <Container>
      <Title>LEADERBOARD</Title>

      <TeamStats>
        <TeamCard
          $team="pepe"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>PEPE ARMY</h2>
          <StatGrid>
            <StatItem>
              <h3>{teamStats.pepe.totalMemes}</h3>
              <p>Total Memes</p>
            </StatItem>
            <StatItem>
              <h3>{teamStats.pepe.totalVotes}</h3>
              <p>Total Votes</p>
            </StatItem>
            <StatItem>
              <h3>{teamStats.pepe.avgLikes}</h3>
              <p>Avg. Likes</p>
            </StatItem>
          </StatGrid>
        </TeamCard>

        <TeamCard
          $team="doge"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>DOGE SQUAD</h2>
          <StatGrid>
            <StatItem>
              <h3>{teamStats.doge.totalMemes}</h3>
              <p>Total Memes</p>
            </StatItem>
            <StatItem>
              <h3>{teamStats.doge.totalVotes}</h3>
              <p>Total Votes</p>
            </StatItem>
            <StatItem>
              <h3>{teamStats.doge.avgLikes}</h3>
              <p>Avg. Likes</p>
            </StatItem>
          </StatGrid>
        </TeamCard>
      </TeamStats>

      <TabContainer>
        {['memes', 'votes', 'likes'].map(tab => (
          <Tab
            key={tab}
            $active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Top {getLabel(tab)}
          </Tab>
        ))}
      </TabContainer>

      <LeaderboardGrid>
        {mockData[activeTab].map((item, index) => (
          <LeaderboardItem
            key={item.id}
            $team={item.team}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="rank">#{index + 1}</div>
            <div className="content">
              <div className="user">
                <img src={item.image} alt={item.user} />
                <div className="info">
                  <h3>{item.user}</h3>
                  <div className="team">
                    {item.team === 'pepe' ? 'PEPE ARMY' : 'DOGE SQUAD'}
                  </div>
                </div>
              </div>
              <div className="stats">
                <div className="value">{item.value}</div>
                <div className="label">{getLabel(activeTab)}</div>
              </div>
            </div>
          </LeaderboardItem>
        ))}
      </LeaderboardGrid>

      <SectionTitle>MOST VOTED MEMES</SectionTitle>
      <TopMemesGrid>
        {mockTopMemes.map((meme, index) => (
          <TopMemeCard
            key={meme.id}
            meme={meme}
            rank={index}
          />
        ))}
      </TopMemesGrid>
    </Container>
  );
};

export default LeaderboardPage;