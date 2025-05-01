import { GameQueryBuilder } from "@/types/game";
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
          `${namespace}-GameEvent`
        ],
        [addAddressPadding(gameId)]
      ).build()
    )
    .withEntityModels([
      `${namespace}-GameEvent`,
    ])
    .includeHashedKeys()
    .withOrderBy(
      [
        {
          model: `${namespace}-GameEvent`,
          member: "action_count",
          direction: "Desc"
        }
      ]
    )
    .withLimit(1)
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
      historical: false,
      callback: ({ data, error }: { data: any, error: Error | null }) => {
        if (error) {
          console.error('Subscription error:', error);
        } else if (data) {
          console.log("Game Event Data:", data);
          // useGameStore.getState().setGameEvent(data);
        }
      }
    })

    console.log('initialData gameEvent', initialData);
    useGameStore.getState().setGameEvents(initialData.map((event: any) => event.models[`${namespace}`]));
    eventSubscription = subscription;
  } catch (error) {
    console.error('Subscription error:', error);
    return () => { };
  }
}