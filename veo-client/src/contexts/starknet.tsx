import { ControllerConnector } from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { dojoConfig } from "../../dojoConfig";

import { PropsWithChildren, useCallback, useMemo } from "react";

const StarknetChainId = {
  SN_MAIN: "0x534e5f4d41494e",
  SN_SEPOLIA: "0x534e5f5345504f4c4941",
}

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE
const game_systems = getContractByName(dojoConfig.manifest, namespace, "game_systems")?.address
const game_token_systems = getContractByName(dojoConfig.manifest, namespace, "game_token_systems")?.address

// Custom hook for creating dynamic connector
function useDynamicControllerConnector(
  customPolicies?: any[],
  customSlot?: string,
  customPreset?: string,
  customChains?: any[]
) {
  return useMemo(() => {
    const policies = customPolicies || [
      {
        target: game_token_systems,
        method: "mint",
      },
      {
        target: game_systems,
        method: "start_game",
      },
      {
        target: game_systems,
        method: "explore",
      },
      {
        target: game_systems,
        method: "attack",
      },
      {
        target: game_systems,
        method: "flee",
      },
      {
        target: game_systems,
        method: "buy_items",
      },
      {
        target: game_systems,
        method: "equip",
      },
      {
        target: game_systems,
        method: "drop",
      },
      {
        target: game_systems,
        method: "select_stat_upgrades",
      },
      {
        target: import.meta.env.VITE_PUBLIC_VRF_PROVIDER_ADDRESS,
        method: "request_random",
        description: "Allows requesting random numbers from the VRF provider",
      },
    ];

    return new ControllerConnector({
      policies,
      namespace,
      slot: customSlot || "lootsurvivor-sepolia-2",
      preset: customPreset || "loot-survivor",
      chains: customChains || [{ rpcUrl: dojoConfig.rpcUrl }],
      defaultChainId: import.meta.env.VITE_PUBLIC_CHAIN_ID === 'mainnet' ? StarknetChainId.SN_MAIN : StarknetChainId.SN_SEPOLIA,
    });
  }, [customPolicies, customSlot, customPreset, customChains]);
}

// Context for dynamic connector configuration
import { createContext, useContext, useState } from 'react';

interface ConnectorConfig {
  policies?: any[];
  slot?: string;
  preset?: string;
  chains?: any[];
}

interface DynamicConnectorContext {
  config: ConnectorConfig;
  updateConfig: (newConfig: Partial<ConnectorConfig>) => void;
  resetConfig: () => void;
}

const DynamicConnectorContext = createContext<DynamicConnectorContext | null>(null);

export function DynamicConnectorProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<ConnectorConfig>({});

  const updateConfig = useCallback((newConfig: Partial<ConnectorConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({});
  }, []);

  const connector = useDynamicControllerConnector(
    config.policies,
    config.slot,
    config.preset,
    config.chains
  );

  const rpc = useCallback(() => {
    return { nodeUrl: dojoConfig.rpcUrl };
  }, []);

  return (
    <DynamicConnectorContext.Provider value={{ config, updateConfig, resetConfig }}>
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={jsonRpcProvider({ rpc })}
        connectors={[connector]}
        explorer={voyager}
        autoConnect={true}
      >
        {children}
      </StarknetConfig>
    </DynamicConnectorContext.Provider>
  );
}

export function useDynamicConnector() {
  const context = useContext(DynamicConnectorContext);
  if (!context) {
    throw new Error('useDynamicConnector must be used within a DynamicConnectorProvider');
  }
  return context;
}

// Legacy provider for backward compatibility
export default function StarknetProvider({ children }: PropsWithChildren) {
  const connector = useDynamicControllerConnector();

  const rpc = useCallback(() => {
    return { nodeUrl: dojoConfig.rpcUrl };
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={[connector]}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
