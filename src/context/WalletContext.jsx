import { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import styles directly
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContext = createContext();

export function WalletContextProvider({ children }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

function WalletProvider({ children }) {
  const { connected, publicKey, connecting, disconnecting, select, disconnect } = useSolanaWallet();
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      console.log('Wallet connected:', address);
      setWalletAddress(address);
    } else {
      console.log('Wallet disconnected');
      setWalletAddress(null);
    }
  }, [connected, publicKey]);

  // Debug logging
  useEffect(() => {
    console.log('Wallet state changed:', {
      connected,
      connecting,
      disconnecting,
      walletAddress,
      hasPublicKey: !!publicKey
    });
  }, [connected, connecting, disconnecting, walletAddress, publicKey]);

  const value = {
    connected,
    connecting,
    disconnecting,
    walletAddress,
    select,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export default WalletContextProvider;
