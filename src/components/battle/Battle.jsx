import React from 'react';
import BattleContainer from './BattleContainer';
import SplitScreen from './SplitScreen';
import Side from './Side';
import Content from './Content';
import MemeGrid from './MemeGrid';
import VoteMeter from './VoteMeter';

const Battle = ({ battle, onVote, userVote }) => {
  if (!battle) return null;

  return (
    <BattleContainer>
      <VoteMeter 
        leftVotes={battle.votes?.left || 0}
        rightVotes={battle.votes?.right || 0}
      />
      <SplitScreen>
        <Side side="left" battleId={battle.id}>
          <Content>
            <MemeGrid 
              memes={battle.memes?.filter(m => m.team === 'left') || []}
              onVote={() => onVote('left')}
              voted={userVote === 'left'}
              side="left"
            />
          </Content>
        </Side>
        <Side side="right" battleId={battle.id}>
          <Content>
            <MemeGrid 
              memes={battle.memes?.filter(m => m.team === 'right') || []}
              onVote={() => onVote('right')}
              voted={userVote === 'right'}
              side="right"
            />
          </Content>
        </Side>
      </SplitScreen>
    </BattleContainer>
  );
};

export default Battle;
