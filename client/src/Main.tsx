import { createRoot } from "react-dom/client";

import App from "./App.tsx";

// Dojo related imports
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import type { SchemaType } from "./generated/models.gen.ts";
import { setupWorld } from "./generated/contracts.gen.ts";

import "./index.css";
import { dojoConfig } from "../dojoConfig.ts";
import StarknetProvider from "./providers/starknet.tsx";


async function main() {
  const sdk = await init<SchemaType>({
    client: {
      worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {}
  });

  createRoot(document.getElementById("root")!).render(
    <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
      <StarknetProvider>
        <App />
      </StarknetProvider>
    </DojoSdkProvider>
  );
}

main().catch((error) => {
  console.error("Failed to initialize the application:", error);
});
