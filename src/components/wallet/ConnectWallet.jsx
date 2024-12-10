import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';

const WalletButton = styled(WalletMultiButton)`
  background-color: ${props => props.theme.colors.primary} !important;
  border-radius: 8px !important;
  height: 40px !important;
  color: white !important;
  font-family: ${props => props.theme.fonts.heading} !important;
  font-size: 14px !important;
  padding: 0 20px !important;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}dd !important;
  }
  
  &:not([disabled]):hover {
    background-color: ${props => props.theme.colors.primary}dd !important;
  }
`;

const ConnectWallet = () => {
  const { publicKey } = useWallet();

  return (
    <WalletButton>
      {publicKey ? 'Connected' : 'Connect Wallet'}
    </WalletButton>
  );
};

export default ConnectWallet;
