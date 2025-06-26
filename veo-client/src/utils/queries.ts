import { useDojoConfig } from "@/contexts/starknet";
import { GameQueryBuilder } from "@/types/game";
import { ClauseBuilder } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";

export const useQueries = () => {
  const dojoConfig = useDojoConfig();
  
  const getGameEvents = async (adventurerId: number) => {
    const response = await fetch(`${dojoConfig.toriiUrl}/sql?query=
      SELECT * FROM "${dojoConfig.namespace}-GameEvent"
      WHERE adventurer_id = "${adventurerId.toString(16)}"
      ORDER BY timestamp DESC
      LIMIT 100
    `);

    const data = await response.json();
    return data;
  };

  const getGameEventsByType = async (adventurerId: number, eventType: string) => {
    const response = await fetch(`${dojoConfig.toriiUrl}/sql?query=
      SELECT * FROM "${dojoConfig.namespace}-GameEvent"
      WHERE adventurer_id = "${adventurerId.toString(16)}" AND event_type = "${eventType}"
      ORDER BY timestamp DESC
      LIMIT 100
    `);

    const data = await response.json();
    return data;
  };

  const gameEventsQuery = (gameId: number) => {
    return new GameQueryBuilder()
      .withClause(
        new ClauseBuilder().keys(
          [
            `${dojoConfig.namespace}-GameEvent`,
          ],
          [addAddressPadding(`0x${gameId.toString(16)}`)]
        ).build()
      )
      .withEntityModels([
        `${dojoConfig.namespace}-GameEvent`,
      ])
      .withLimit(10000)
  };

  return { getGameEvents, getGameEventsByType, gameEventsQuery };
};