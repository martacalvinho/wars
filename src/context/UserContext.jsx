import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { getUser, createUser, logWalletActivity } from '../lib/supabase';
import { generateRandomUsername } from '../utils/username';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wallet, connected } = useWallet();

  useEffect(() => {
    async function handleWalletConnection() {
      if (connected && wallet?.publicKey) {
        try {
          setLoading(true);
          const walletAddress = wallet.publicKey.toString();
          
          // Try to get existing user
          let userData = await getUser(walletAddress).catch(() => null);
          
          // Create new user if doesn't exist
          if (!userData) {
            userData = await createUser({
              wallet_address: walletAddress,
              username: generateRandomUsername(),
              wallet_type: 'phantom',
              wallet_network: 'mainnet'
            });
          }

          // Log the connection
          await logWalletActivity({
            p_user_id: userData.id,
            p_wallet_address: walletAddress,
            p_activity_type: 'connect'
          });

          setUser(userData);
        } catch (error) {
          console.error('Error handling wallet connection:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    handleWalletConnection();
  }, [connected, wallet]);

  // Log disconnect when wallet disconnects
  useEffect(() => {
    if (!connected && user) {
      logWalletActivity({
        p_user_id: user.id,
        p_wallet_address: user.wallet_address,
        p_activity_type: 'disconnect'
      }).catch(console.error);
    }
  }, [connected, user]);

  const value = {
    user,
    loading,
    setUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}