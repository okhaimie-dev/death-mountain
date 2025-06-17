import { GameQueryBuilder } from "@/types/game";
import { ClauseBuilder } from "@dojoengine/sdk";

import { addAddressPadding } from "starknet";

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;

export const gameEventsQuery = (gameId: number) => {
  return new GameQueryBuilder()
    .withClause(
      new ClauseBuilder().keys(
        [
          `${namespace}-GameEvent`,
        ],
        [addAddressPadding(`0x${gameId.toString(16)}`)]
      ).build()
    )
    .withEntityModels([
      `${namespace}-GameEvent`,
    ])
    .withLimit(10000)
}