import { createDojoConfig } from "@dojoengine/core";

import manifest from "./manifest_sepolia.json";

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
    toriiUrl: import.meta.env.VITE_PUBLIC_TORII,
});
