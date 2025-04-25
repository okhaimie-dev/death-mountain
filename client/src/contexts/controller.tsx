import { useGameStore } from '@/stores/gameStore';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { dojoConfig } from "../../dojoConfig";

export interface ControllerContext {
  account: any;
  address: string | undefined;
  playerName: string;
  connecting: boolean | undefined;
}

// Create a context
const ControllerContext = createContext<ControllerContext>({} as ControllerContext);

// Create a provider component
export const ControllerProvider = ({ children }: PropsWithChildren) => {
  const { account, address, isConnecting } = useAccount()
  const { connector } = useConnect();
  const { disconnect } = useDisconnect()

  const [userName, setUserName] = useState()

  useEffect(() => {
    if (account) {
      // Handle mixed networks
      if ((account as any).walletProvider?.account?.channel?.nodeUrl && (account as any).walletProvider.account.channel.nodeUrl !== dojoConfig.rpcUrl) {
        return disconnect()
      }
    }
  }, [account]);

  useEffect(() => {
    async function controllerName() {
      try {
        const name = await (connector as any)?.username()
        if (name) {
          setUserName(name)
        }
      } catch (error) {
      }
    }

    controllerName()
  }, [connector])

  return (
    <ControllerContext.Provider value={{
      account,
      address,
      playerName: userName || "",
      connecting: isConnecting,
    }}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = () => {
  return useContext(ControllerContext);
};

