import { useGameStore } from '@/stores/gameStore';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { dojoConfig } from "../../dojoConfig";
import { fetchGameTokens } from '@/dojo/useGameTokens';

export interface ControllerContext {
  account: any;
  address: string | undefined;
  playerName: string;
  connecting: boolean | undefined;
  gameTokens: string[];
}

// Create a context
const ControllerContext = createContext<ControllerContext>({} as ControllerContext);

// Create a provider component
export const ControllerProvider = ({ children }: PropsWithChildren) => {
  const { account, address, isConnecting } = useAccount()
  const { connector } = useConnect();
  const { disconnect } = useDisconnect()

  const { gameId, exitGame } = useGameStore();
  const [userName, setUserName] = useState()
  const [gameTokens, setGameTokens] = useState([]);

  useEffect(() => {
    if (account) {
      // Handle mixed networks
      if ((account as any).walletProvider?.account?.channel?.nodeUrl && (account as any).walletProvider.account.channel.nodeUrl !== dojoConfig.rpcUrl) {
        return disconnect()
      }

      // Handle game tokens
      fetchGameTokens(account.address).then(tokens => {
        setGameTokens(tokens)
      })
    }
  }, [account]);

  useEffect(() => {
    if (!account && gameId) {
      exitGame()
    }
  }, [gameId]);

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
      gameTokens,
    }}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = () => {
  return useContext(ControllerContext);
};

