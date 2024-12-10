import styled from 'styled-components';
import { motion } from 'framer-motion';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  cursor: pointer;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px ${props => props.theme.colors.primary}40;
  }
`;

const SelectArrow = styled(motion.div)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${props => props.theme.colors.primary};
`;

const TeamSelect = ({ value, onChange }) => {
  const teams = [
    { id: 'none', name: 'Select Your Team', color: '#FFFFFF' },
    { id: 'pepe', name: 'PEPE ARMY', color: '#FF3366' },
    { id: 'doge', name: 'DOGE SQUAD', color: '#00F5FF' }
  ];

  return (
    <SelectWrapper>
      <StyledSelect value={value} onChange={onChange}>
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </StyledSelect>
      <SelectArrow
        animate={{ y: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ▼
      </SelectArrow>
    </SelectWrapper>
  );
};

export default TeamSelect;