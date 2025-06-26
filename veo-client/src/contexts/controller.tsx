import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useDynamicConnector } from './starknet';

export interface ControllerContext {
  account: any;
  address: string | undefined;
  playerName: string;
  isPending: boolean;

  openProfile: () => void;
  login: () => void;
  logout: () => void;
}

// Create a context
const ControllerContext = createContext<ControllerContext>({} as ControllerContext);

// Create a provider component
export const ControllerProvider = ({ children }: PropsWithChildren) => {
  const { account, address, isConnecting } = useAccount();
  const { connector, connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { currentNetworkConfig } = useDynamicConnector();

  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    if (account) {
      // Handle mixed networks
      if ((account as any).walletProvider?.account?.channel?.nodeUrl && (account as any).walletProvider.account.channel.nodeUrl !== currentNetworkConfig.chains[0].rpcUrl) {
        return disconnect()
      }
    }
  }, [account]);

  // Get username when connector changes
  useEffect(() => {
    const getUsername = async () => {
      try {
        const name = await (connector as any)?.username();
        if (name) setUserName(name);
      } catch (error) {
        console.error('Error getting username:', error);
      }
    };

    if (connector) getUsername();
  }, [connector]);

  const openProfile = () => {
    if (!account) {
      const controllerConnector = connectors.find(conn => conn.id === "controller");
      if (controllerConnector) connect({ connector: controllerConnector });
      return;
    }
    
    (connector as any)?.controller?.openProfile();
  };

  const login = async () => {
    const controllerConnector = connectors.find(conn => conn.id === "controller");
    
    if (!controllerConnector || account || isConnecting || isPending) {
      return;
    }
    
    connect({ connector: controllerConnector });
  };

  return (
    <ControllerContext.Provider value={{
      account,
      address,
      playerName: userName || "Adventurer",
      isPending: isConnecting || isPending,
      openProfile,
      login,
      logout: disconnect
    }}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = () => {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error('useController must be used within a ControllerProvider');
  }
  return context;
};

