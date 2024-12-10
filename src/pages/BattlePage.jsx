import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import CommentSection from '../components/comments/CommentSection';
import MemeSort from '../components/memes/MemeSort';
import SplitScreen from '../components/battle/SplitScreen';
import Side from '../components/battle/Side';
import Content from '../components/battle/Content';
import MemeGrid from '../components/battle/MemeGrid';
import MemeCard from '../components/battle/MemeCard';
import MemeModal from '../components/battle/MemeModal';
import BattleHeader from '../components/battle/BattleHeader';
import VoteMeter from '../components/battle/VoteMeter';

const BattlePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 60px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CommentsPanel = styled.div`
  background: rgba(26, 27, 58, 0.95);
  padding: 2rem;
  border-top: 1px solid ${props => props.theme.colors.primary}40;
  backdrop-filter: blur(10px);
`;

const BattlePage = () => {
  const [votes, setVotes] = useState({ left: 420, right: 369 });
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [memes, setMemes] = useState(
    Array.from({ length: 20 }, (_, i) => ({ 
      id: i + 1, 
      image: `https://picsum.photos/800/800?random=${i}`, 
      likes: Math.floor(Math.random() * 100),
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      side: i % 2 === 0 ? 'left' : 'right'
    }))
  );
  const [likedMemes, setLikedMemes] = useState(new Set());
  const { user, updateUser } = useUser();

  const sortedMemes = useMemo(() => {
    return [...memes].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return b.likes - a.likes;
    });
  }, [memes, sortBy]);

  const handleVoteBar = (side) => {
    setVotes(prev => ({
      ...prev,
      [side]: prev[side] + 1
    }));

    updateUser({
      stats: {
        ...user.stats,
        votes: (user.stats.votes || 0) + 1
      }
    });
  };

  const handleMemeLike = (meme) => {
    const newMemes = [...memes];
    const memeIndex = newMemes.findIndex(m => m.id === meme.id);
    
    if (memeIndex !== -1) {
      const isLiked = likedMemes.has(meme.id);
      newMemes[memeIndex] = {
        ...newMemes[memeIndex],
        likes: newMemes[memeIndex].likes + (isLiked ? -1 : 1)
      };
      
      setMemes(newMemes);
      setLikedMemes(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(meme.id);
        } else {
          newSet.add(meme.id);
        }
        return newSet;
      });
    }

    updateUser({
      stats: {
        ...user.stats,
        likes: (user.stats.likes || 0) + 1
      }
    });
  };

  const renderSide = (side) => (
    <Side side={side}>
      <Content>
        <MemeSort sortBy={sortBy} onSortChange={setSortBy} side={side} />
        <MemeGrid>
          {sortedMemes
            .filter(meme => meme.side === side)
            .map(meme => (
              <MemeCard
                key={meme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMeme(meme)}
                liked={likedMemes.has(meme.id)}
                onLike={() => handleMemeLike(meme)}
                likes={meme.likes}
              >
                <img src={meme.image} alt="Meme" />
              </MemeCard>
            ))}
        </MemeGrid>
      </Content>
    </Side>
  );

  return (
    <BattlePageContainer>
      <MainContent>
        <BattleHeader />
        <SplitScreen>
          {renderSide('left')}
          <VoteMeter
            votes={votes}
            onVote={handleVoteBar}
          />
          {renderSide('right')}
        </SplitScreen>
      </MainContent>

      <CommentsPanel>
        <CommentSection battleId="active" />
      </CommentsPanel>

      <AnimatePresence>
        {selectedMeme && (
          <MemeModal
            meme={selectedMeme}
            onClose={() => setSelectedMeme(null)}
            onLike={() => handleMemeLike(selectedMeme)}
            liked={likedMemes.has(selectedMeme.id)}
          />
        )}
      </AnimatePresence>
    </BattlePageContainer>
  );
};

export default BattlePage;