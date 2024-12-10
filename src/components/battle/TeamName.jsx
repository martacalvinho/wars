import styled from 'styled-components';

const TeamName = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px ${props => props.side === 'left' ? '#FF3366' : '#00F5FF'};
`;

export default TeamName;