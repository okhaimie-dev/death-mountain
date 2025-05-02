import { GameQueryBuilder } from "@/types/game";
import { formatBattleEvent, formatExploreEvent } from "@/utils/events";
import { ClauseBuilder } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { useGameStore } from '../stores/gameStore';

let eventSubscription: any = null;
const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;

const gameEventsQuery = (gameId: number) => {
  return new GameQueryBuilder()
    .withClause(
      new ClauseBuilder().keys(
        [
          `${namespace}-GameEvent`,
          `${namespace}-BattleEvent`,
        ],
        [addAddressPadding(gameId)]
      ).build()
    )
    .withEntityModels([
      `${namespace}-GameEvent`,
      `${namespace}-BattleEvent`,
    ])
}

const updateGameStore = (entities: any, includeBattleEvents: boolean) => {
  let exploreEvents = formatExploreEvent(entities);
  useGameStore.getState().setExploreLog(exploreEvents);

  if (includeBattleEvents) {
    let battleEvents = formatBattleEvent(entities);
    if (battleEvents.length > 0) {
      useGameStore.getState().setBattleLog(battleEvents);
    }
  }
}

export async function setupGameEventsSubscription(sdk: any, gameId: number) {
  // Cancel existing subscription if any
  if (eventSubscription) {
    eventSubscription.cancel();
    eventSubscription = null;
  }

  try {
    const [initialData, subscription] = await sdk.subscribeEventQuery({
      query: gameEventsQuery(gameId),
      historical: true,
      callback: ({ data, error }: { data: any, error: Error | null }) => {
        if (error) {
          console.error('Event subscription error:', error);
        } else if (data) {
          updateGameStore(data, true);
        }
      }
    })

    updateGameStore(initialData, false);
    eventSubscription = subscription;
  } catch (error) {
    console.error('Event subscription error:', error);
    return () => { };
  }
}