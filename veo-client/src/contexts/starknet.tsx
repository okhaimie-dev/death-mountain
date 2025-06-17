import { ControllerConnector } from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { dojoConfig } from "../../dojoConfig";

import { PropsWithChildren, useCallback } from "react";
const StarknetChainId = {
  SN_MAIN: "0x534e5f4d41494e",
  SN_SEPOLIA: "0x534e5f5345504f4c4941",
}

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE
const game_systems = getContractByName(dojoConfig.manifest, namespace, "game_systems")?.address
const game_token_systems = getContractByName(dojoConfig.manifest, namespace, "game_token_systems")?.address


const cartridge = new ControllerConnector({
  policies: [
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
  ],
  namespace,
  slot: "lootsurvivor-sepolia",
  preset: "loot-survivor",
  chains: [{ rpcUrl: dojoConfig.rpcUrl }],
  defaultChainId: import.meta.env.VITE_PUBLIC_CHAIN_ID === 'mainnet' ? StarknetChainId.SN_MAIN : StarknetChainId.SN_SEPOLIA,
})

export default function StarknetProvider({ children }: PropsWithChildren) {
  const rpc = useCallback(() => {
    return { nodeUrl: dojoConfig.rpcUrl };
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={[cartridge]}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
