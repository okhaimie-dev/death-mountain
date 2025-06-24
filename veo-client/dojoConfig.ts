import manifest_sepolia from "./manifest_sepolia.json";

const network = import.meta.env.VITE_PUBLIC_DEFAULT_CHAIN;

export const StarknetChainId = {
  SN_MAIN: "SN_MAIN",
  SN_SEPOLIA: "SN_SEPOLIA",
  WP_PG: "WP_PG",
}

export const NETWORKS = {
  mainnet: {
    chainId: "SN_MAIN",
    name: 'Mainnet',
    status: 'offline',
    namespace: 'ls_0_0_1',
    slot: 'pg-mainnet',
    rpcUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
    torii: 'https://api.cartridge.gg/x/pg-mainnet/torii',
    manifest: manifest_sepolia
  },
  sepolia: {
    chainId: "SN_SEPOLIA",
    name: 'Sepolia',
    status: 'online',
    namespace: 'ls_0_0_1',
    slot: 'lootsurvivor-sepolia-2',
    rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
    torii: 'https://api.cartridge.gg/x/lootsurvivor-sepolia-2/torii',
    manifest: manifest_sepolia
  },
  katana: {
    chainId: "WP_PG",
    name: 'Katana',
    status: 'offline',
    namespace: 'ls_0_0_1',
    slot: 'lootsurvivor-sepolia-2',
    rpcUrl: 'http://localhost:5000',
    torii: 'http://localhost:5000/torii',
    manifest: manifest_sepolia
  }
}

export const dojoConfig = NETWORKS[network as keyof typeof NETWORKS];