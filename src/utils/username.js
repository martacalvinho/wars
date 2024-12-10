export function generateRandomUsername() {
  const adjectives = [
    'Epic', 'Cosmic', 'Mystic', 'Digital', 'Crypto', 'Pixel', 'Based', 'Rare', 
    'Dank', 'Mega', 'Ultra', 'Super', 'Hyper', 'Alpha', 'Beta', 'Delta', 
    'Sigma', 'Prime', 'Elite', 'Pro'
  ];
  
  const nouns = [
    'Memer', 'Warrior', 'Legend', 'Master', 'Artist', 'Creator', 'Wizard', 
    'Knight', 'Lord', 'King', 'Queen', 'Sage', 'Phoenix', 'Dragon', 'Tiger', 
    'Eagle', 'Wolf', 'Bear', 'Lion', 'Hawk'
  ];
  
  const number = Math.floor(Math.random() * 1000);
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${number}`;
}
