import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { getUser, createUser, logWalletActivity } from '../lib/supabase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connected, walletAddress } = useWallet();

  useEffect(() => {
    let mounted = true;

    async function handleWalletConnection() {
      try {
        if (!connected || !walletAddress) {
          setUser(null);
          return;
        }

        setLoading(true);
        console.log('Fetching user for wallet:', walletAddress);

        // Try to get existing user
        let userData = await getUser(walletAddress);
        console.log('Existing user data:', userData);
        
        // If user doesn't exist, create new user
        if (!userData) {
          console.log('Creating new user for wallet:', walletAddress);
          try {
            userData = await createUser({
              wallet_address: walletAddress
            });
            console.log('Created new user:', userData);
          } catch (createError) {
            console.error('Error creating user:', createError);
            return;
          }
        }

        // Log the wallet activity
        try {
          await logWalletActivity({
            wallet_address: walletAddress,
            action_type: 'connect'
          });
        } catch (logError) {
          console.error('Error logging activity:', logError);
        }

        if (mounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in wallet connection flow:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    handleWalletConnection();

    return () => {
      mounted = false;
    };
  }, [connected, walletAddress]);

  // Debug log to help track user state
  useEffect(() => {
    console.log('User state changed:', { 
      user, 
      loading, 
      connected, 
      walletAddress,
      hasUser: !!user,
      isConnected: !!connected,
      hasWallet: !!walletAddress
    });
  }, [user, loading, connected, walletAddress]);

  const value = {
    user,
    loading,
    isConnected: connected,
    walletAddress
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;