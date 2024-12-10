import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    team: 'none',
    joinedAt: null,
    stats: {
      comments: 0,
      memes: 0,
      votes: 0
    }
  });

  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      stats: {
        ...prev.stats,
        ...updates.stats
      }
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};