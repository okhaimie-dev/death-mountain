import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { dojoConfig } from "../../dojoConfig";

export interface ControllerContext {
  account: any;
  address: string | undefined;
  playerName: string;
  isPending: boolean | undefined;

  openProfile: () => void;
  login: () => void;
  logout: () => void;
}

// Create a context
const ControllerContext = createContext<ControllerContext>({} as ControllerContext);

// Create a provider component
export const ControllerProvider = ({ children }: PropsWithChildren) => {
  const { account, address, isConnecting } = useAccount()
  const { connector, connectors, connect, isPending } = useConnect();
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
      playerName: userName || "Adventurer",
      isPending: isConnecting || isPending,

      openProfile: () => (connector as any)?.controller?.openProfile(),
      login: () => connect({ connector: connectors.find(conn => conn.id === "controller") }),
      logout: () => disconnect()
    }}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = () => {
  return useContext(ControllerContext);
};

